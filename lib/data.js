/*
  This library is used to update the mutable data associated with a token.
*/

// const { Web3Storage, File } = require('web3.storage')

class Data {
  constructor (localConfig = {}) {
    // Dependency injection
    this.bchjs = localConfig.bchjs
    if (!this.bchjs) {
      throw new Error(
        'bch-js instance required when instantiating get.js library'
      )
    }
    this.web3Storage = localConfig.web3Storage
    if (!this.web3Storage) {
      throw new Error(
        'Must pass instance of web3.storage library when instantiating slp-mutable-data library.'
      )
    }

    // Encapsulate dependencies
    this.Web3Storage = this.web3Storage.Web3Storage
    this.File = this.web3Storage.File
  }

  // Upload data to Filecoin.
  async uploadToFilecoin (data, apiKey) {
    try {
      if (!apiKey) {
        throw new Error(
          'apiKey needs to contain the API key from web3.storage.'
        )
      }

      const files = this.makeFileObjects(data)

      const storage = new this.Web3Storage({ token: apiKey })

      const cid = await storage.put(files)

      return cid
    } catch (err) {
      console.log('Error in uploadToFilecoin()')
      throw err
    }
  }

  // Converts an object to a File, which can then be uploaded to Filecoin.
  makeFileObjects (obj) {
    try {
      const buffer = Buffer.from(JSON.stringify(obj))

      const files = [new this.File([buffer], 'data.json')]
      return files
    } catch (err) {
      console.log('Error in makeFileObjects()')
      throw err
    }
  }

  async writeCIDToOpReturn (cid, wif) {
    try {
      if (!wif || typeof wif !== 'string') {
        throw new Error('wif private key required')
      }
      if (!cid || typeof cid !== 'string') {
        throw new Error('CID of IPFS or Filecoin data required')
      }

      // Generate a key pair from the wif.
      const ecPair = this.bchjs.ECPair.fromWIF(wif)
      const address = this.bchjs.ECPair.toCashAddress(ecPair)
      console.log(`Updating mutable data for ${address}`)

      // Get UTXOs controlled by this address.
      const utxos = await this.bchjs.Utxo.get(address)
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
      console.log('Error in writeCIDToOpReturn')
      throw err
    }
  }
}

module.exports = Data
