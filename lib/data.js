/*
  This library is used to create mutable and immutable data, and to update the
  mutable data associated with a token.

  Primary functions:

  - createTokenData() - is used to get the IPFS CID representing data that goes
    into the mutable and immutable data of the token.

  - writeCIDToOpReturn() - is used to update mutable data by writing a new
    pointer to the Mutable Data Address (MDA) on the BCH blockchain.
*/

// Public npm libraries
const { Pin, Write } = require('p2wdb')
const RetryQueue = require('@chris.troutner/retry-queue-commonjs')

class Data {
  constructor (localConfig = {}) {
    // Dependency injection
    this.wallet = localConfig.wallet
    if (!this.wallet) {
      throw new Error(
        'Instance of minimal-slp-wallet must be passed as wallet when instantiating this library.'
      )
    }

    // Allow user to specify P2WDB server at run-time.
    // this.serverURL = 'https://p2wdb.fullstack.cash'
    this.serverURL = 'https://p2wdb.fullstackcash.nl'
    // this.serverURL = 'http://localhost:5010'
    if (localConfig.serverURL) this.serverURL = localConfig.serverURL

    // Allow user to specify Pinning service at run-time.
    this.pinServer = 'https://p2wdb-pin.fullstack.cash'
    // this.pinServer = 'http://localhost:5021'
    if (localConfig.pinServer) this.pinServer = localConfig.pinServer

    // Encapsulate dependencies
    this.bchjs = this.wallet.bchjs
    this.write = new Write({ bchWallet: this.wallet, serverURL: this.serverURL })
    this.pin = new Pin({ bchWallet: this.wallet, serverURL: this.serverURL, pinServer: this.pinServer })
    this.retryQueue = new RetryQueue({
      attempts: 3,
      retryPeriod: 1000
    })

    // Bind 'this' object to functions that lose context.
    this.writeJsonToP2wdb = this.writeJsonToP2wdb.bind(this)
    this.pinJson = this.pinJson.bind(this)
  }

  // This function will pin an arbitrary object to IPFS using the P2WDB
  // pinning service. It will convert the object to JSON, upload it to P2WDB,
  // then ask the pinning cluster to pin the JSON. This function will return
  // the IPFS CID of the pinned JSON object.
  //
  // This function is useful for generating mutable and immutable data prior
  // to creating a token.
  //
  // This function uses the retry-queue to automatically retry if there
  // is a network communcation issue.
  async createTokenData (inObj) {
    try {
      // Write the data to the P2WDB
      const zcid = await this.retryQueue.addToQueue(this.writeJsonToP2wdb, inObj)
      // console.log('createTokenData() zcid: ', zcid)

      const inObj2 = { zcid }

      // Pin the JSON data to IPFS
      const { ipfsCid } = await this.retryQueue.addToQueue(this.pinJson, inObj2)
      // console.log('createTokenData() ipfsCid: ', ipfsCid)
      // console.log('createTokenData() p2wdbPinCid: ', p2wdbPinCid)

      return ipfsCid
    } catch (err) {
      console.error('Error in p2wdb/data.js pinJson()')
      throw err
    }
  }

  // This is a promise-based function that accepts an object as input. The
  // object is converted to JSON and uploaded to the P2WDB.
  async writeJsonToP2wdb (inObj) {
    try {
      const appId = 'token-data-001'

      // Refresh the UTXOs in the wallet
      // await this.write.bchWallet.initialize()
      await this.wallet.initialize()

      const result = await this.write.postEntry(inObj, appId)
      // console.log('writeJsonToP2wdb() result: ', result)

      return result.hash
    } catch (err) {
      console.error('Error in p2wdb/data.js writeJsonToP2wdb()')
      throw err
    }
  }

  // This is a promise-based function that accepts an object as input.
  // The inObj expects a zcid property. This is the P2WDB CID used to retrieve
  // a JSON entry from the P2WDB. That JSON is extracted and pinned via the
  // P2WDB Pinning Service to a single IPFS node.
  //
  // Once the JSON is pinned, a second P2WDB write pins the JSON across the
  // entire cluster of P2WDB Pinning Service nodes.
  //
  // The promise resolves into a P2WDB zcid of the pin request.
  async pinJson (inObj) {
    try {
      const { zcid } = inObj

      // Refresh the UTXOs in the wallet
      // await this.pin.bchWallet.initialize()
      await this.wallet.initialize()

      // Pin the CID with the single Pinning Service node.
      const cid = await this.pin.json(zcid)
      // console.log('pinJson() cid: ', cid)

      // Pin the JSON to all nodes in the Pinning Service cluster.
      const result = await this.pin.cid(cid)
      // console.log('pinJson() result: ', result)

      const ipfsCid = cid
      const p2wdbPinCid = result.hash

      return { ipfsCid, p2wdbPinCid }
    } catch (err) {
      console.error('Error in p2wdb/data.js pinJson()')
      throw err
    }
  }

  // This function writes data to the OP_RETURN of a transaction. This is used
  // to update the mutable data of a token, by writing the CID of the new update
  // to the BCH address identified with mutable data (the MDA).
  //
  // If the WIF is not specified, the WIF from the instance of minimal-slp-wallet
  // will be used.
  async writeCIDToOpReturn (cid, wif) {
    try {
      if (!cid || typeof cid !== 'string') {
        throw new Error('CID of IPFS or Filecoin data required')
      }

      // Ensure the wallet has been created.
      await this.wallet.walletInfoPromise

      // If WIF is not specified, use the WIF from the wallet used to
      // initialize this library.
      if (!wif) {
        wif = this.wallet.walletInfo.privateKey
      }

      // Generate a key pair from the wif.
      const ecPair = this.bchjs.ECPair.fromWIF(wif)
      const address = this.bchjs.ECPair.toCashAddress(ecPair)
      console.log(`Updating mutable data for ${address}`)

      // Get UTXOs controlled by this address.
      // const utxos = await this.bchjs.Utxo.get(address)
      const utxos = await this.wallet.getUtxos(address)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      // Get the biggest UTXO controlled by the wallet, to pay for tx fees.
      const utxo = await this.bchjs.Utxo.findBiggestUtxo(utxos.bchUtxos)
      // console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`)

      // instance of transaction builder
      const transactionBuilder = new this.bchjs.TransactionBuilder()

      const originalAmount = utxo.value
      const vout = utxo.tx_pos
      const txid = utxo.tx_hash

      // add input with txid and index of vout
      transactionBuilder.addInput(txid, vout)

      // Set the transaction fee. Manually set for ease of example.
      const txFee = 550

      // amount to send back to the sending address.
      // Subtract two dust transactions for minting baton and tokens.
      const remainder = originalAmount - 500 - txFee
      // console.log(`remainder: ${remainder}`)

      if (remainder < 546) {
        throw new Error(`Biggest UTXO for ${address} is not big enough. remainder: ${remainder}`)
      }

      // Generate the OP_RETURN data
      const script = [
        this.bchjs.Script.opcodes.OP_RETURN,
        Buffer.from(JSON.stringify({ cid }))
      ]

      // Compile the script array into a bitcoin-compliant hex encoded string.
      const data = this.bchjs.Script.encode(script)

      // Add the OP_RETURN output.
      transactionBuilder.addOutput(data, 0)

      // Send change back to originating address.
      transactionBuilder.addOutput(address, remainder)

      // Sign the transaction with the HD node.
      let redeemScript
      transactionBuilder.sign(
        0,
        ecPair,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        originalAmount
      )

      // build tx
      const tx = transactionBuilder.build()

      // output rawhex
      const hex = tx.toHex()

      return hex
    } catch (err) {
      console.log('Error in writeCIDToOpReturn: ', err)
      throw err
    }
  }

  // Instantiate the retry-queue library, which is an ESM library,
  // and needs to be loaded with dynamic import.
  // async loadRetryQueueLib () {
  //   if (!this.retryQueue) {
  //     const retryQueueLib = await import('@chris.troutner/retry-queue')
  //     const RetryQueue = retryQueueLib.default
  //     this.retryQueue = new RetryQueue({ retryPeriod: 2000, attempts: 3 })
  //   }
  // }
}

module.exports = Data
