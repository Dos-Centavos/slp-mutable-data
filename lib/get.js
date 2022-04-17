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

  // Attempt to retrieve mutable and immutable data associated with a token.
  async data (tokenId) {
    try {
      // Retrieve IPFS CIDs for both mutable and immutable data.
      const { mutableCid, immutableCid, tokenStats } = await this.dataCids(tokenId)

      // Get mutable data.
      const mutableDataUrl = `https://${mutableCid}.ipfs.dweb.link/data.json`
      const response1 = await this.axios.get(mutableDataUrl)
      const mutableData = response1.data

      // Get immutable data.
      const immutableDataUrl = `https://${immutableCid}.ipfs.dweb.link/data.json`
      const response2 = await this.axios.get(immutableDataUrl)
      const immutableData = response2.data

      return { immutableData, mutableData, tokenStats }
    } catch (err) {
      console.log('Error in slp-mutable-data/get.js/data()')
      throw err
    }
  }

  // Retrieve the IPFS CIDs for both mutable and immutable data.
  // Returns an object with IPFS CIDs for mutable and immutable data.
  async dataCids (tokenId) {
    try {
      if (!tokenId || typeof tokenId !== 'string') {
        throw new Error(
          'tokenId string required when calling get.mutableData()'
        )
      }

      // Get token Genesis data from the psf-slp-indexer.
      const tokenStats = await this.tokenStats(tokenId)

      // Get the IPFS CID for the immutable data associated with this token.
      const immutableCid = this.immutableCid(tokenStats)

      const mutableCid = await this.mutableCid(tokenStats)

      return { mutableCid, immutableCid, tokenStats }
    } catch (err) {
      console.error('Error in slp-mutable-data/get.js/mutableCid()')
      throw err
    }
  }

  // Get token Genesis information and basic statistics.
  async tokenStats (tokenId) {
    try {
      // Gets the token stats
      const stats = await this.bchjs.PsfSlpIndexer.tokenStats(tokenId)
      // console.log(`stats: ${JSON.stringify(stats, null, 2)}`)

      return stats.tokenData
    } catch (err) {
      console.error('Error in slp-mutable-data/get.js/tokenStats()')
      throw err
    }
  }

  // Get IPFS CID for immutable data. Assumes input to this function is the
  // output of tokenStats()
  immutableCid (tokenStats) {
    try {
      if (!tokenStats.documentUri) {
        throw new Error('No documentUri property found in tokenStats')
      }

      // Get the immutable data CID. Assuming that it's prefixed with ipfs://
      // as per the PS002 specification.
      let immutableCid = tokenStats.documentUri
      immutableCid = immutableCid.substring(7)

      return immutableCid
    } catch (err) {
      console.error('Error in slp-mutable-data/get.js/immutableCid()')
      throw err
    }
  }

  // Get IPFS CID for mutable data. Assumes input to this function is the
  // output of tokenStats()
  async mutableCid (tokenStats) {
    try {
      if (!tokenStats.documentHash) {
        throw new Error('No documentHash property found in tokenStats')
      }

      // Gets the OP_RETURN data and decodes it
      const mutableData = await this.decodeOpReturn(tokenStats.documentHash)
      const jsonData = JSON.parse(mutableData)

      // mda = mutable data address.
      const mda = jsonData.mda

      // Gets the mda transaction history
      const transactions = await this.bchjs.Electrumx.transactions(mda)
      const mdaTxs = transactions.transactions
      // console.log(`mdaTxs: ${JSON.stringify(mdaTxs, null, 2)}`)

      let data = false
      // Maps each transaction of the mda
      // if finds an OP_RETURN decode is and closes the loop
      // Start with the newest TXID entry and scan the history to find the first
      // entry with an IPFS CID.
      for (let i = mdaTxs.length - 1; i > -1; i--) {
        const tx = mdaTxs[i]
        const txid = tx.tx_hash
        console.log(`Retrieving and decoding txid ${txid}`)

        data = await this.decodeOpReturn(txid)
        // console.log('data: ', data)

        //  Try parse the OP_RETURN data to a JSON object.
        if (data) {
          try {
            // console.log('Mutable Data  : ', data)

            // Convert the OP_RETURN data to a JSON object.
            const obj = JSON.parse(data)
            // console.log(`obj: ${JSON.stringify(obj, null, 2)}`)

            // Keep searching if this TX does not have a cid value.
            if (!obj.cid) continue

            // TODO: Ensure data was generated by the MDA and not an
            // update from a different address.

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
      // console.log('cid: ', cid)

      // Assuming that CID starts with ipfs://. Cutting out that prefix.
      const mutableCid = cid.substring(7)

      return mutableCid
    } catch (err) {
      console.error('Error in slp-mutable-data/get.js/mutableCid()')
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
