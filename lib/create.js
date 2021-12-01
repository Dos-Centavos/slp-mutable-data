/*
  A library for creating SLP tokens with mutable data.

  Implements this specification for mutable data:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps002-slp-mutable-data.md

*/

class Create {
  constructor (localConfig = {}) {
    // Dependency Injections
    this.bchjs = localConfig.bchjs
    if (!this.bchjs) {
      throw new Error(
        'bch-js instance required when instantiating get.js library'
      )
    }
  }

  // Create a new SLP token with mutable data.
  async createToken (wif, tokenData, mspAddr) {
    try {
      const { name, ticker, documentUrl, decimals, initialQty, mintBatonVout } =
        tokenData

      const documentHash = await this.createMutableTxid(wif, mspAddr)
      console.log(`documentHash: ${documentHash}`)

      // Wait a couple seconds to let the indexer update its UXTO state.
      await this.bchjs.Util.sleep(2000)

      // Generate SLP config object
      const slpData = {
        name,
        ticker,
        documentUrl,
        decimals,
        initialQty,
        documentHash,
        mintBatonVout
      }

      // Build Token
      const hex = await this.buildTokenTx(wif, slpData)

      // Broadcast token
      const txid = await this.bchjs.RawTransactions.sendRawTransaction([hex])

      return txid
    } catch (err) {
      console.error('Error in createToken()')
      throw err
    }
  }

  // Build a transaction for creating a new token.
  async buildTokenTx (wif, slpData) {
    try {
      // Generate a key pair from the wif.
      const ecPair = this.bchjs.ECPair.fromWIF(wif)
      // const publicKey = this.bchjs.ECPair.toPublicKey(ecPair).toString('hex')
      const address = this.bchjs.ECPair.toCashAddress(ecPair)

      // Get the biggest UTXO controlled by the wallet, to pay for tx fees.
      const utxos = await this.bchjs.Utxo.get(address)
      const utxo = await this.bchjs.Utxo.findBiggestUtxo(utxos[0].bchUtxos)

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
      const remainder = originalAmount - 546 * 2 - txFee

      // Generate the OP_RETURN entry for an SLP GENESIS transaction.
      const script = this.bchjs.SLP.TokenType1.generateGenesisOpReturn(slpData)
      // const data = bchjs.Script.encode(script)
      // const data = compile(script)

      // OP_RETURN needs to be the first output in the transaction.
      transactionBuilder.addOutput(script, 0)

      // Send dust transaction representing the tokens.
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(address),
        546
      )

      // Send dust transaction representing minting baton.
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(address),
        546
      )

      // add output to send BCH remainder of UTXO.
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
      console.log('Error in create-token/buildTokenTx()', err)
      throw err
    }
  }

  // This function is called by createToken, in order to generate the TXID
  // for the mutable data. This TX points to the mutable data address, and the
  // TXID is used in the 'documentHash' property of the SLP token.
  async createMutableTxid (wif, mspAddr) {
    try {
      // Generate a key pair from the wif.
      const ecPair = this.bchjs.ECPair.fromWIF(wif)
      // const publicKey = this.bchjs.ECPair.toPublicKey(ecPair).toString('hex')
      const address = this.bchjs.ECPair.toCashAddress(ecPair)

      // Get the biggest UTXO controlled by the wallet, to pay for tx fees.
      const utxos = await this.bchjs.Utxo.get(address)
      const utxo = await this.bchjs.Utxo.findBiggestUtxo(utxos[0].bchUtxos)

      // instance of transaction builder
      const transactionBuilder = new this.bchjs.TransactionBuilder()

      const originalAmount = utxo.value
      const vout = utxo.tx_pos
      const txid = utxo.tx_hash

      // add input with txid and index of vout
      transactionBuilder.addInput(txid, vout)

      // TODO: Compute the 1 sat/byte fee.
      const fee = 500
      const dust = 546

      // Generate the OP_RETURN data
      const mspObj = {
        mspAddress: mspAddr
      }
      const script = [
        this.bchjs.Script.opcodes.OP_RETURN,
        Buffer.from(JSON.stringify(mspObj))
      ]

      // Compile the script array into a bitcoin-compliant hex encoded string.
      const data = this.bchjs.Script.encode(script)

      // Add the OP_RETURN output.
      transactionBuilder.addOutput(data, 0)

      // Send dust to the MSP address to cryptographically link it to this TX.
      transactionBuilder.addOutput(mspAddr, dust)

      // Send change back to originating address.
      transactionBuilder.addOutput(address, originalAmount - fee - dust)

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

      // Broadcast transaction to the network
      const txidStr = await this.bchjs.RawTransactions.sendRawTransaction(hex)

      return txidStr
    } catch (err) {
      console.error('Error in createMutableTxid()')
      throw err
    }
  }

  // Mint additional tokens.
  // async mint (wif, tokenData) {
  //   try {
  //   } catch (err) {
  //     console.error('Error in createToken()')
  //     throw err
  //   }
  // }
}

module.exports = Create