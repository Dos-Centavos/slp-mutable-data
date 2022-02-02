/*
  A library for getting information about a token, including its mutable and
  immutable data.

  Implements this specification for mutable data:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps002-slp-mutable-data.md

*/

const axios = require('axios')

class Get {
  constructor (localConfig = {}) {
    // Dependency injection
    this.bchjs = localConfig.bchjs
    if (!this.bchjs) {
      throw new Error(
        'bch-js instance required when instantiating get.js library'
      )
    }

    // Encapsulate dependencies
    this.axios = axios
  }

  // Retrieves the mutable data associated with a token.
  async mutableData (tokenId) {
    try {
      if (!tokenId || typeof tokenId !== 'string') {
        throw new Error(
          'tokenId string required when calling get.mutableData()'
        )
      }

      // Gets the token stats
      const stats = await this.bchjs.SLP.Utils.tokenStats(tokenId)

      // Gets the OP_RETURN data and decodes it
      const mutableData = await this.decodeOpReturn(stats.documentHash)
      const jsonData = JSON.parse(mutableData)

      const mspAddress = jsonData.mspAddress

      // Gets the mspAddress transactions
      const transactions = await this.bchjs.Electrumx.transactions(mspAddress)
      const mspTxs = transactions.transactions
      // console.log(`mspTxs: ${JSON.stringify(mspTxs, null, 2)}`)

      let data = false
      // Maps each transaction of the mspAddress
      // if finds an OP_RETURN decode is and closes the loop
      // Start with the oldest TXID entry and work scan to the newest.
      for (let i = mspTxs.length - 1; i > -1; i--) {
        const tx = mspTxs[i]
        const txid = tx.tx_hash

        data = await this.decodeOpReturn(txid)
        //  Try parse the OP_RETURN data to a JSON object.
        if (data) {
          try {
            // console.log('Mutable Data  : ', data)

            // Convert the OP_RETURN data to a JSON object.
            const obj = JSON.parse(data)
            // console.log(`obj: ${JSON.stringify(obj, null, 2)}`)

            // Keep searching if this TX does not have a cid value.
            if (!obj.cid) continue

            break
          } catch (error) {
            continue
          }
        }
      }

      if (!data) {
        console.log('Mutable Data  Not found ')
      }

      // Get the CID:
      const obj = JSON.parse(data)
      const cid = obj.cid
      if (!cid) {
        throw new Error('CID could not be found in OP_RETURN data')
      }

      const dataUrl = `https://${cid}.ipfs.dweb.link/mutable-data.json`

      const response = await axios.get(dataUrl)
      // console.log(`response.data: ${JSON.stringify(response.data, null, 2)}`)

      return response.data
    } catch (err) {
      if (err.code !== 'EEXIT') console.log('Error in getMutableData().')
      throw err
    }
  }

  // Decodes the OP_RETURN of a transaction if this exists
  async decodeOpReturn (txid) {
    try {
      if (!txid || typeof txid !== 'string') {
        throw new Error('txid must be a string')
      }
      // get transaction data
      const txData = await this.bchjs.Electrumx.txData(txid)

      let data = false
      // Maps the vout of the transaction in search of an OP_RETURN
      for (let i = 0; i < txData.details.vout.length; i++) {
        const vout = txData.details.vout[i]

        const script = this.bchjs.Script.toASM(
          Buffer.from(vout.scriptPubKey.hex, 'hex')
        ).split(' ')

        if (script[0] === 'OP_RETURN') {
          data = Buffer.from(script[1], 'hex').toString('ascii')
          break
        }
      }
      return data
    } catch (error) {
      console.log('Error in decodeOpReturn().')
      throw error
    }
  }
}

module.exports = Get