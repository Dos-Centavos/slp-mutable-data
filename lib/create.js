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
  // Three different token types: fungible, group, nft
  // fungible = default, normal Type 1 SLP tokens
  async createToken (wif, tokenData, mda, destAddr, tokenType = 'fungible', groupId) {
    try {
      const { name, ticker, documentUrl, decimals, initialQty, mintBatonVout } =
      tokenData

      const documentHash = await this.createMutableTxid(wif, mda)
      console.log(`documentHash TXID: ${documentHash}`)

      // Wait a couple seconds to allow indexer to update UTXOs.
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

      let hex

      // Build Token transaction
      if (tokenType === 'nft') {
        hex = await this.buildNftTokenTx(wif, slpData, groupId, destAddr)
      } else {
        hex = await this.buildTokenTx(wif, slpData, destAddr, tokenType)
      }

      // Broadcast token
      const txid = await this.bchjs.RawTransactions.sendRawTransaction([hex])

      return txid
    } catch (err) {
      console.error('Error in createToken()')
      throw err
    }
  }

  // Build a transaction for creating a new Type1 or Group token.
  async buildTokenTx (wif, slpData, destAddr, tokenType = 'fungible') {
    try {
      if (!wif || typeof wif !== 'string') {
        throw new Error('WIF must be a string')
      }
      if (!slpData || typeof slpData !== 'object') {
        throw new Error('slpData must be an object')
      }
      // Generate a key pair from the wif.
      const ecPair = this.bchjs.ECPair.fromWIF(wif)
      // const publicKey = this.bchjs.ECPair.toPublicKey(ecPair).toString('hex')
      const address = this.bchjs.ECPair.toCashAddress(ecPair)

      // Get UTXOs held by the address.
      const utxos = await this.bchjs.Utxo.get(address)
      if (utxos.bchUtxos.length === 0) {
        throw new Error('No BCH UTXOs found in wallet.')
      }

      // Get the biggest UTXO controlled by the wallet, to pay for tx fees.
      const utxo = await this.bchjs.Utxo.findBiggestUtxo(utxos.bchUtxos)

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

      let script

      // Generate the OP_RETURN entry for an SLP GENESIS transaction.
      if (tokenType === 'group') {
        script = this.bchjs.SLP.NFT1.newNFTGroupOpReturn(slpData)
      } else {
        script = this.bchjs.SLP.TokenType1.generateGenesisOpReturn(slpData)
      }

      // OP_RETURN needs to be the first output in the transaction.
      transactionBuilder.addOutput(script, 0)

      const _destAddr = destAddr || address
      // Send dust transaction representing the tokens.
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(_destAddr),
        546
      )

      if (slpData.mintBatonVout !== null) {
        // Send dust transaction representing minting baton.
        transactionBuilder.addOutput(
          this.bchjs.Address.toLegacyAddress(address),
          546
        )
      }

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
      console.log('Error in create-token/buildTokenTx()')
      throw err
    }
  }

  // Build a transaction for creating an NFT.
  async buildNftTokenTx (wif, slpData, groupId, destAddr) {
    try {
      // Input validation
      if (!wif || typeof wif !== 'string') {
        throw new Error('WIF must be a string')
      }
      if (!slpData || typeof slpData !== 'object') {
        throw new Error('slpData must be an object')
      }
      if (!groupId || typeof groupId !== 'string') {
        throw new Error('groupId must be a string')
      }

      // Generate a key pair from the wif.
      const ecPair = this.bchjs.ECPair.fromWIF(wif)
      // const publicKey = this.bchjs.ECPair.toPublicKey(ecPair).toString('hex')
      const address = this.bchjs.ECPair.toCashAddress(ecPair)

      // Get UTXOs held by the address.
      const utxos = await this.bchjs.Utxo.get(address)
      let groupUtxos = utxos.slpUtxos.group.tokens

      if (utxos.bchUtxos.length === 0) {
        throw new Error('No BCH UTXOs found in wallet.')
      }

      // Get the biggest UTXO controlled by the wallet, to pay for tx fees.
      const utxo = await this.bchjs.Utxo.findBiggestUtxo(utxos.bchUtxos)

      // Filter out the token UTXOs that match the user-provided token ID
      // and contain the minting baton.
      groupUtxos = groupUtxos.filter((utxo, index) => {
        if (
          utxo && // UTXO is associated with a token.
          utxo.tokenId === groupId && // UTXO matches the token ID.
          utxo.type === 'token' // UTXO is not a minting baton.
        ) {
          return true
        }

        return false
      })
      console.log(`groupUtxos: ${JSON.stringify(groupUtxos, null, 2)}`)

      if (groupUtxos.length === 0) {
        throw new Error('No token UTXOs for the specified Group token could be found.')
      }

      // instance of transaction builder
      const transactionBuilder = new this.bchjs.TransactionBuilder()

      const originalAmount = utxo.value
      const vout = utxo.tx_pos
      const txid = utxo.tx_hash

      // add the NFT Group UTXO as an input. This NFT Group token must be burned
      // to create a Child NFT, as per the spec.
      transactionBuilder.addInput(groupUtxos[0].tx_hash, groupUtxos[0].tx_pos)

      // add input with txid and index of vout
      transactionBuilder.addInput(txid, vout)

      // Set the transaction fee. Manually set for ease of example.
      const txFee = 550

      // amount to send back to the sending address.
      // Subtract two dust transactions for minting baton and tokens.
      const remainder = originalAmount - 546 * 2 - txFee

      // Generate the OP_RETURN entry for an SLP GENESIS transaction.
      const script = this.bchjs.SLP.NFT1.generateNFTChildGenesisOpReturn(slpData)

      // OP_RETURN needs to be the first output in the transaction.
      transactionBuilder.addOutput(script, 0)

      const _destAddr = destAddr || address
      // Send dust transaction representing the tokens.
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(_destAddr),
        546
      )

      if (slpData.mintBatonVout !== null) {
        // Send dust transaction representing minting baton.
        transactionBuilder.addOutput(
          this.bchjs.Address.toLegacyAddress(address),
          546
        )
      }

      // add output to send BCH remainder of UTXO.
      transactionBuilder.addOutput(address, remainder)

      // Sign the transaction with the HD node.
      let redeemScript
      transactionBuilder.sign(
        0,
        ecPair,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        groupUtxos[0].value
      )
      transactionBuilder.sign(
        1,
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
      console.log('Error in create-token/buildTokenTx()')
      throw err
    }
  }

  // This function is called by createToken, in order to generate the TXID
  // for the mutable data. This TX points to the mutable data address (mda),
  // and the TXID is used in the 'documentHash' property of the SLP token.
  async createMutableTxid (wif, mda) {
    try {
      if (!wif || typeof wif !== 'string') {
        throw new Error('WIF must be a string')
      }
      if (!mda || typeof mda !== 'string') {
        throw new Error('mda must be a string')
      }

      // Generate a key pair from the wif.
      const ecPair = this.bchjs.ECPair.fromWIF(wif)
      // const publicKey = this.bchjs.ECPair.toPublicKey(ecPair).toString('hex')
      const address = this.bchjs.ECPair.toCashAddress(ecPair)

      // Get UTXOs held by the address.
      const utxos = await this.bchjs.Utxo.get(address)

      if (utxos.bchUtxos.length === 0) {
        throw new Error('No BCH UTXOs found in wallet.')
      }

      // Get the biggest UTXO controlled by the wallet, to pay for tx fees.
      const utxo = await this.bchjs.Utxo.findBiggestUtxo(utxos.bchUtxos)

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
      const script = [
        this.bchjs.Script.opcodes.OP_RETURN,
        Buffer.from(JSON.stringify({ mda }))
      ]

      // Compile the script array into a bitcoin-compliant hex encoded string.
      const data = this.bchjs.Script.encode(script)

      // Add the OP_RETURN output.
      transactionBuilder.addOutput(data, 0)

      // Send dust to the MSP address to cryptographically link it to this TX.
      transactionBuilder.addOutput(mda, dust)

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
}

module.exports = Create
