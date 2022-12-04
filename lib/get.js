/*
  A library for getting information about a token, including its mutable and
  immutable data.

  Implements this specification for mutable data:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps002-slp-mutable-data.md

*/

// Global npm libraries
const axios = require('axios')

class Get {
  constructor (localConfig = {}) {
    // Dependency Injections
    this.wallet = localConfig.wallet
    if (!this.wallet) {
      throw new Error(
        'Instance of minimal-slp-wallet must be passed as wallet when instantiating get.js library.'
      )
    }

    // cidUrlType has a value of 1 or 2:
    // 1 - The CID should go at the end, as a directory.
    // 2 - The CID should go at the beginning of the URL, as a subdomain.
    this.cidUrlType = 1
    if (localConfig.cidUrlType) this.cidUrlType = localConfig.cidUrlType

    // The Gateway URL is used to retrieve IPFS data.
    this.ipfsGatewayUrl = 'p2wdb-gateway-678.fullstack.cash' // Type 1 CID URL.
    // this.ipfsGatewayUrl = 'ipfs.dweb.link/data.json' // Type 2 CID URL.
    if (localConfig.ipfsGatewayUrl) this.ipfsGatewayUrl = localConfig.ipfsGatewayUrl

    // Encapsulate dependencies
    this.bchjs = this.wallet.bchjs
    this.axios = axios

    // Bind 'this' object to functions that lose context.
    this.data = this.data.bind(this)
    this.dataCids = this.dataCids.bind(this)
    this.tokenStats = this.tokenStats.bind(this)
    this.mutableCid = this.mutableCid.bind(this)
    this.decodeOpReturn = this.decodeOpReturn.bind(this)
    this.getCidData = this.getCidData.bind(this)
  }

  // Attempt to retrieve mutable and immutable data associated with a token.
  async data (tokenId) {
    try {
      // Retrieve IPFS CIDs for both mutable and immutable data.
      const { mutableCid, immutableCid, tokenStats } = await this.dataCids(tokenId)

      // Get mutable data.
      const mutableData = await this.getCidData(mutableCid)

      // Get immutable data.
      const immutableData = await this.getCidData(immutableCid)

      return { immutableData, mutableData, tokenStats }
    } catch (err) {
      console.log('Error in slp-mutable-data/get.js/data(): ', err)
      throw err
    }
  }

  // Retrieve the IPFS CIDs for both mutable and immutable data.
  // Returns an object with IPFS CIDs for mutable and immutable data.
  async dataCids (tokenId) {
    try {
      if (!tokenId || typeof tokenId !== 'string') {
        throw new Error(
          'tokenId string required when calling get.dataCids()'
        )
      }

      // Get token Genesis data from the psf-slp-indexer.
      const tokenStats = await this.tokenStats(tokenId)

      // Get the IPFS CID for the immutable data associated with this token.
      const immutableCid = this.immutableCid(tokenStats)

      const mutableCid = await this.mutableCid(tokenStats)

      return { mutableCid, immutableCid, tokenStats }
    } catch (err) {
      console.error('Error in slp-mutable-data/get.js/dataCids()')
      throw err
    }
  }

  // Get token Genesis information and basic statistics.
  async tokenStats (tokenId) {
    try {
      if (!tokenId || typeof tokenId !== 'string') {
        throw new Error(
          'tokenId string required when calling get.tokenStats()'
        )
      }
      // Gets the token stats
      // const stats = await this.bchjs.PsfSlpIndexer.tokenStats(tokenId)
      const stats = await this.wallet.getTokenData(tokenId)
      // console.log(`stats: ${JSON.stringify(stats, null, 2)}`)

      return stats.genesisData
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
      return false
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
      // console.log(`mutableData: ${JSON.stringify(mutableData, null, 2)}`)
      const jsonData = JSON.parse(mutableData)

      // mda = mutable data address.
      let mda = jsonData.mda

      // Convert to a BCH address if it is an ecash address.
      if (mda.includes('ecash') || mda.includes('etoken')) {
        mda = this.bchjs.Address.ecashtoCashAddress(mda)
      }

      // Gets the mda transaction history
      // const transactions = await this.bchjs.Electrumx.transactions(mda)
      const transactions = await this.wallet.getTransactions(mda)
      // console.log(`transactions: ${JSON.stringify(transactions, null, 2)}`)
      console.log(`MDA has ${transactions.length} transactions in its history.`)

      const mdaTxs = transactions
      // console.log(`mdaTxs: ${JSON.stringify(mdaTxs, null, 2)}`)

      let data = false

      // These are used to filter blockchain data to find the most recent
      // update to the MDA.
      let largestBlock = 700000
      let largestTimestamp = 1666107111271
      let bestEntry

      // Used to track the number of transactions before the best candidate is found.
      let txCnt = 0

      // Maps each transaction of the mda.
      // If it finds an OP_RETURN, decode it and exit the loop.
      // Start with the newest TXID entry and scan the history to find the first
      // entry with an IPFS CID.
      // for (let i = mdaTxs.length - 1; i > -1; i--) {
      for (let i = 0; i < mdaTxs.length; i++) {
        const tx = mdaTxs[i]
        const txid = tx.tx_hash
        txCnt++

        data = await this.decodeOpReturn(txid)
        // console.log('slp-mutable-data data: ', data)

        //  Try parse the OP_RETURN data to a JSON object.
        if (data) {
          try {
            // console.log('Mutable Data  : ', data)

            // Convert the OP_RETURN data to a JSON object.
            const obj = JSON.parse(data)
            // console.log(`slp-mutable-data obj: ${JSON.stringify(obj, null, 2)}`)

            // Keep searching if this TX does not have a cid value.
            if (!obj.cid) continue

            // Ensure data was generated by the MDA
            const txData = await this.wallet.getTxData([txid])
            // console.log(`txData: ${JSON.stringify(txData, null, 2)}`)
            let vinAddress = txData[0].vin[0].address
            // console.log(`vinAddress: ${vinAddress}`)

            // Convert to a BCH address if it is an ecash address.
            if (vinAddress.includes('ecash') || vinAddress.includes('etoken')) {
              vinAddress = this.bchjs.Address.ecashtoCashAddress(vinAddress)
            }

            // console.log('mda: ', mda)
            // console.log('vinAddress: ', vinAddress)

            // Skip entry if it was not made by the MDA private key.
            if (mda !== vinAddress) {
              // console.log('Data is not generated by MDA')
              continue
            }

            // First best entry found
            if (!bestEntry) {
              bestEntry = data
              largestBlock = tx.height

              if (obj.ts) {
                largestTimestamp = obj.ts
              }
            } else {
              // One candidate already found. Looking for potentially better
              // entry.

              if (tx.height < largestBlock) {
                // Exit loop if next candidate has an older block height.
                break
              }

              if (obj.ts && obj.ts < largestTimestamp) {
                // Continue looping through entries if the current entry in
                // the same block has a smaller timestamp.
                continue
              }

              bestEntry = data
              largestBlock = tx.height
              if (obj.ts) {
                largestTimestamp = obj.ts
              }

              // console.log('new best entry: ', bestEntry)
            }

            // break
          } catch (error) {
            continue
          }
        }
      }
      console.log(`${txCnt} transactions reviewed to find mutable data.`)

      // Get the CID:
      const obj = JSON.parse(bestEntry)
      const cid = obj.cid
      // Dev note 10/18/22: I think this error handling line below can be
      // deleted. I don't think it's possible to get to that line in the
      // code path because of the check on line 177.
      // if (!cid) {
      //   throw new Error('CID could not be found in OP_RETURN data')
      // }
      // console.log('cid: ', cid)

      // Assuming that CID starts with ipfs://. Cutting out that prefix.
      const mutableCid = cid.substring(7)
      // console.log(`mutableCid: ${mutableCid}`)

      return mutableCid
    } catch (err) {
      console.error('Error in slp-mutable-data/get.js/mutableCid()')
      return false
    }
  }

  // Decodes the OP_RETURN of a transaction if this exists
  async decodeOpReturn (txid) {
    try {
      // Input validation
      if (!txid || typeof txid !== 'string') {
        throw new Error('txid must be a string')
      }

      // get transaction data
      // const txData = await this.bchjs.Electrumx.txData(txid)
      let txData = await this.wallet.getTxData([txid])
      txData = txData[0]
      // console.log(`txData: ${JSON.stringify(txData, null, 2)}`)

      let data = false

      // Maps the vout of the transaction in search of an OP_RETURN
      for (let i = 0; i < txData.vout.length; i++) {
        const vout = txData.vout[i]

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
      console.error('Error in decodeOpReturn(): ', error)
      throw error
    }
  }

  // Get json data from ipfs gateway
  async getCidData (cid) {
    try {
      if (!cid || typeof cid !== 'string') {
        throw new Error('cid must be a string')
      }

      let url = ''

      if (this.cidUrlType === 1) {
        url = `https://${this.ipfsGatewayUrl}/ipfs/${cid}/data.json`
      } else {
        // CID URL type 2
        url = `https://${cid}.${this.ipfsGatewayUrl}/data.json`
      }

      // const url = `https://${cid}.ipfs.dweb.link/data.json`
      const response = await this.axios.get(url)
      const data = response.data
      return data
    } catch (error) {
      return {}
    }
  }
}

module.exports = Get
