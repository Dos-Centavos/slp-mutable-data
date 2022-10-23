/*
Unit tests for the get.js  library.
*/

// npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const BchWallet = require('minimal-slp-wallet')
const cloneDeep = require('lodash.clonedeep')

const wallet = new BchWallet()

// Mocking data libraries.
const mockDataLib = require('./mocks/get-mocks')

// Unit under test
const GetLib = require('../../lib/get')
const uut = new GetLib({ wallet })

describe('#get.js', () => {
  let sandbox
  let mockData

  beforeEach(() => {
    // Restore the sandbox before each test.
    sandbox = sinon.createSandbox()

    // Clone the mock data.
    mockData = cloneDeep(mockDataLib)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should instantiate the class', async () => {
      try {
        // Mock external dependencies.
        const _uut = new GetLib({ wallet })
        assert.exists(_uut)
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should throw an error if minimal-slp-wallet is not provided', async () => {
      try {
        // Mock external dependencies.
        const _uut = new GetLib()
        console.log(_uut)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'Instance of minimal-slp-wallet must be passed as wallet when instantiating get.js library.')
      }
    })

    it('should override default IPFS gateway', async () => {
      try {
        const options = {
          wallet,
          cidUrlType: 2,
          ipfsGatewayUrl: 'test.com'
        }

        // Mock external dependencies.
        const _uut = new GetLib(options)

        assert.equal(_uut.cidUrlType, 2)
        assert.equal(_uut.ipfsGatewayUrl, 'test.com')
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })
  })

  describe('#getCidData', () => {
    it('return an empty object on error', async () => {
      sandbox
        .stub(uut.axios, 'get')
        .throws(new Error())

      const cid = 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'
      const result = await uut.getCidData(cid)
      assert.isEmpty(result)
    })

    it('should return data from gateway', async () => {
      sandbox
        .stub(uut.axios, 'get')
        .resolves({ data: mockData.immutableData })

      const cid = 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'
      const result = await uut.getCidData(cid)
      // console.log('result: ', result)

      assert.isObject(result)
    })

    it('should get data from CID URL Type 2', async () => {
      sandbox
        .stub(uut.axios, 'get')
        .resolves({ data: mockData.immutableData })

      // Force desired code path
      uut.cidUrlType = 2
      uut.ipfsGatewayUrl = 'test.com'

      const cid = 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'
      const result = await uut.getCidData(cid)
      // console.log('result: ', result)

      assert.isObject(result)
    })
  })

  describe('#decodeOpReturn', () => {
    it('should throw errors if txid is not provided', async () => {
      try {
        await uut.decodeOpReturn()
        assert.fail('unexpected code path')
      } catch (error) {
        assert.include(
          error.message,
          'txid must be a string',
          'Error message expected'
        )
      }
    })

    it('should handle bchjs error', async () => {
      try {
        sandbox.stub(uut.wallet, 'getTxData').rejects(new Error('test error'))

        const txid = 'c37ba29f40ecc61662ea56324fdb72a5f1e66add2078854c2144765b9030358a'

        await uut.decodeOpReturn(txid)

        assert.fail('unexpected code path')
      } catch (error) {
        assert.include(
          error.message,
          'test error',
          'Error message expected'
        )
      }
    })

    it('should return data', async () => {
      sandbox.stub(uut.wallet, 'getTxData').resolves(mockData.txData02)

      const txid = 'c37ba29f40ecc61662ea56324fdb72a5f1e66add2078854c2144765b9030358a'

      const result = await uut.decodeOpReturn(txid)
      // console.log(result)

      assert.include(result, 'ipfs://')
    })

    it('should return  false if data is not found', async () => {
      sandbox.stub(uut.wallet, 'getTxData').resolves([{ vout: [] }])

      const txid = 'c37ba29f40ecc61662ea56324fdb72a5f1e66add2078854c2144765b9030358a'

      const result = await uut.decodeOpReturn(txid)

      assert.isFalse(result)
    })
  })

  describe('#mutableCid', () => {
    it('should return mutable cid from documentHash property', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .onFirstCall().resolves('{"mda":"bitcoincash:qplnej5md740lkl6qt0qf0g2mkv7dwfscskjask5s8"}')
        .onSecondCall().resolves('abc') // data to force an error while parsing the JSON. Increases code coverage.
        .onThirdCall().resolves('{ "cid": "ipfs://bafybeigotuony53ley3n63hqwyxiqruqn5uamskmci6f645putnc46jju4" }')
        // .onCall(4).resolves('{"cid":"ipfs://bafybeigotuony53ley3n63hqwyxiqruqn5uamskmci6f645putnc46jju4"}')
      sandbox
        .stub(uut.wallet, 'getTransactions')
        .resolves(mockData.transactions02)
      sandbox
        .stub(uut.wallet, 'getTxData')
        .resolves(mockData.txData02)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)

      assert.equal(result, 'bafybeigotuony53ley3n63hqwyxiqruqn5uamskmci6f645putnc46jju4')
    })

    it('should return false if documentHash property is missing', async () => {
      const tokenStats = {}
      const result = await uut.mutableCid(tokenStats)
      assert.isFalse(result)
    })

    it('should return false if op return cant be decoded', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .throws(new Error())

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)
      assert.isFalse(result)
    })

    it('should return false if cid cant be found', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .onFirstCall().resolves(mockData.decodedOpReturn)
        .resolves(JSON.stringify({}))

      sandbox
        .stub(uut.wallet, 'getTransactions')
        .resolves(mockData.transactions02)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)
      assert.isFalse(result)
    })

    it('should return false if data found is not generated by mda', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .onFirstCall().resolves('{"mda":"bitcoincash:qplnej5md740lkl6qt0qf0g2mkv7dwfscskjask5s8"}')
        .onSecondCall().resolves('{ "cid": "ipfs://bafybeigotuony53ley3n63hqwyxiqruqn5uamskmci6f645putnc46jju4" }')

      sandbox
        .stub(uut.wallet, 'getTransactions')
        .resolves(mockData.transactions02)
      sandbox
        .stub(uut.wallet, 'getTxData')
        .resolves(mockData.txDataWithoutMDA02)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)
      assert.isFalse(result)
    })

    it('should return older mutable cid for two entries in the same block', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .onCall(0).resolves('{"mda":"bitcoincash:qplnej5md740lkl6qt0qf0g2mkv7dwfscskjask5s8"}')
        .onCall(1).resolves('{ "cid": "ipfs://bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrre", "ts": 1666106998771 }')
        .onCall(2).resolves('{ "cid": "ipfs://bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrrf", "ts": 1666107111271 }')
      sandbox
        .stub(uut.wallet, 'getTransactions')
        .resolves(mockData.transactions03)
      sandbox
        .stub(uut.wallet, 'getTxData')
        .resolves(mockData.txData02)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)

      assert.equal(result, 'bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrrf')
    })

    // Same test as above, but the entries are switched in the order they are processed.
    it('should return older mutable cid if entries are switched in the same block', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .onCall(0).resolves('{"mda":"bitcoincash:qplnej5md740lkl6qt0qf0g2mkv7dwfscskjask5s8"}')
        .onCall(1).resolves('{ "cid": "ipfs://bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrrf", "ts": 1666107111271 }')
        .onCall(2).resolves('{ "cid": "ipfs://bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrre", "ts": 1666106998771 }')

      sandbox
        .stub(uut.wallet, 'getTransactions')
        .resolves(mockData.transactions03)
      sandbox
        .stub(uut.wallet, 'getTxData')
        .resolves(mockData.txData02)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)

      assert.equal(result, 'bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrrf')
    })

    it('should stop searching for best entry if block height is less', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .onCall(0).resolves('{"mda":"bitcoincash:qplnej5md740lkl6qt0qf0g2mkv7dwfscskjask5s8"}')
        .onCall(1).resolves('{ "cid": "ipfs://bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrrf", "ts": 1666107111271 }')
        .onCall(2).resolves('{ "cid": "ipfs://bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrre", "ts": 1666106998771 }')

      mockData.transactions03[1].height = 762680
      sandbox
        .stub(uut.wallet, 'getTransactions')
        .resolves(mockData.transactions03)
      sandbox
        .stub(uut.wallet, 'getTxData')
        .resolves(mockData.txData02)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)

      assert.equal(result, 'bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrrf')
    })

    it('should return mutable cid from an ecash address', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .onFirstCall().resolves('{"mda":"ecash:qplnej5md740lkl6qt0qf0g2mkv7dwfscs0lfmdwks"}')
        .onSecondCall().resolves('abc') // data to force an error while parsing the JSON. Increases code coverage.
        .onThirdCall().resolves('{ "cid": "ipfs://bafybeigotuony53ley3n63hqwyxiqruqn5uamskmci6f645putnc46jju4" }')
        // .onCall(4).resolves('{"cid":"ipfs://bafybeigotuony53ley3n63hqwyxiqruqn5uamskmci6f645putnc46jju4"}')
      sandbox
        .stub(uut.wallet, 'getTransactions')
        .resolves(mockData.transactions02)
      mockData.txData02[0].vin[0].address = 'ecash:qplnej5md740lkl6qt0qf0g2mkv7dwfscs0lfmdwks'
      sandbox
        .stub(uut.wallet, 'getTxData')
        .resolves(mockData.txData02)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)

      assert.equal(result, 'bafybeigotuony53ley3n63hqwyxiqruqn5uamskmci6f645putnc46jju4')
    })
  })

  describe('#immutableCid', () => {
    it('should return immutable cid from documentUri property', async () => {
      const tokenStats = mockData.tokenStats.tokenData
      const result = uut.immutableCid(tokenStats)
      assert.isString(result)
    })

    it('should return false if documentUri property is missing', async () => {
      const tokenStats = {}
      const result = uut.immutableCid(tokenStats)
      assert.isFalse(result)
    })
    it('shuld return false on error', async () => {
      const tokenStats = mockData.tokenStats.tokenData
      tokenStats.documentUri = {} // force error
      const result = uut.immutableCid(tokenStats)
      assert.isFalse(result)
    })
  })

  describe('#tokenStats', () => {
    it('should return token stats', async () => {
      // Mock external dependencies.
      sandbox
        .stub(uut.wallet, 'getTokenData')
        .resolves(mockData.tokenStats02)

      const tokenId = 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'
      const result = await uut.tokenStats(tokenId)

      assert.property(result, 'type')
      assert.property(result, 'ticker')
      assert.property(result, 'name')
      assert.property(result, 'tokenId')
      assert.property(result, 'documentUri')
      assert.property(result, 'documentHash')
      assert.property(result, 'decimals')
      assert.property(result, 'mintBatonIsActive')
      assert.property(result, 'tokensInCirculationBN')
      assert.property(result, 'tokensInCirculationStr')
      assert.property(result, 'blockCreated')
      assert.property(result, 'totalBurned')
      assert.property(result, 'totalMinted')
    })

    it('should throw an error if tokenid is not provided', async () => {
      try {
        await uut.tokenStats()
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'tokenId string required')
      }
    })

    it('shuld handle bchjs error', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getTokenData')
          .rejects(new Error('test error'))
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#dataCids', () => {
    it('should return data ', async () => {
      // Mock external dependencies.
      sandbox
        .stub(uut, 'tokenStats')
        .resolves(mockData.tokenStats.tokenData)
      sandbox
        .stub(uut, 'mutableCid')
        .resolves(mockData.cid)

      const tokenId = 'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'
      const result = await uut.dataCids(tokenId)
      assert.isObject(result)
      assert.property(result, 'immutableCid')
      assert.property(result, 'mutableCid')
      assert.property(result, 'tokenStats')
    })

    it('should throw an error if tokenid is not provided', async () => {
      try {
        await uut.dataCids()
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'tokenId string required')
      }
    })

    it('shuld handle error in tokenStats fetch', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut, 'tokenStats')
          .throws(new Error('test error'))

        sandbox
          .stub(uut, 'mutableCid')
          .resolves(mockData.cid)

        const tokenId = 'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'
        await uut.dataCids(tokenId)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#data', () => {
    it('should return token data ', async () => {
      // Mock external dependencies.
      const mutableCid = 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'
      const immutableCid = 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'
      const tokenStats = mockData.tokenStats
      sandbox
        .stub(uut, 'dataCids')
        .resolves({ mutableCid, immutableCid, tokenStats })

      sandbox
        .stub(uut.axios, 'get')
        .resolves({ data: 'data' })

      const tokenId = 'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'
      const result = await uut.data(tokenId)
      assert.isObject(result)
      assert.property(result, 'immutableData')
      assert.property(result, 'mutableData')
      assert.property(result, 'tokenStats')
    })

    it('should throw an error if tokenid is not provided', async () => {
      try {
        await uut.data()
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'tokenId string required')
      }
    })

    it('shuld handle error if tokenStats function throw an error', async () => {
      try {
        sandbox.stub(uut, 'tokenStats').rejects(new Error('test error'))

        const tokenId = 'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'
        await uut.data(tokenId)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })

    it('Should return data even if mutable data is not found', async () => {
      try {
        // Mock external dependencies.
        const mutableCid = false
        const immutableCid = 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'
        const tokenStats = mockData.tokenStats
        sandbox
          .stub(uut, 'dataCids')
          .resolves({ mutableCid, immutableCid, tokenStats })
        sandbox
          .stub(uut.axios, 'get')
          .resolves({ data: 'data' })

        const tokenId = 'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'
        const result = await uut.data(tokenId)
        assert.isObject(result)
        assert.property(result, 'immutableData')
        assert.property(result, 'mutableData')
        assert.property(result, 'tokenStats')
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('Should return data even if immutable data is not found', async () => {
      try {
        // Mock external dependencies.
        const mutableCid = 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'
        const immutableCid = false
        const tokenStats = mockData.tokenStats
        sandbox
          .stub(uut, 'dataCids')
          .resolves({ mutableCid, immutableCid, tokenStats })
        sandbox
          .stub(uut.axios, 'get')
          .resolves({ data: 'data' })

        const tokenId = 'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'
        const result = await uut.data(tokenId)
        assert.isObject(result)
        assert.property(result, 'immutableData')
        assert.property(result, 'mutableData')
        assert.property(result, 'tokenStats')
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('Should return data even if mutable data and immutable data is not found', async () => {
      try {
        // Mock external dependencies.
        const mutableCid = false
        const immutableCid = false
        const tokenStats = mockData.tokenStats
        sandbox
          .stub(uut, 'dataCids')
          .resolves({ mutableCid, immutableCid, tokenStats })
        sandbox
          .stub(uut.axios, 'get')
          .resolves({ data: 'data' })

        const tokenId = 'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'
        const result = await uut.data(tokenId)
        assert.isObject(result)
        assert.property(result, 'immutableData')
        assert.property(result, 'mutableData')
        assert.property(result, 'tokenStats')
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })
  })
})
