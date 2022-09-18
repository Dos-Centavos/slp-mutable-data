/*
  This library is used to update the mutable data associated with a token.
*/

class Data {
  constructor (localConfig = {}) {
    // Dependency injection
    this.wallet = localConfig.wallet
    if (!this.wallet) {
      throw new Error(
        'Instance of minimal-slp-wallet must be passed as wallet when instantiating this library.'
      )
    }

    // Encapsulate dependencies
    this.bchjs = this.wallet.bchjs
  }

  async writeCIDToOpReturn (cid) {
    try {
      if (!cid || typeof cid !== 'string') {
        throw new Error('CID of IPFS or Filecoin data required')
      }

      // Ensure the wallet has been created.
      await this.wallet.walletInfoPromise

      // Extract the private key from the wallet.
      const wif = this.wallet.walletInfo.privateKey

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
}

module.exports = Data
