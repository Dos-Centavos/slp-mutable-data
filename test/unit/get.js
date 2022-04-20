/*
Unit tests for the get.js  library.
*/

// npm libraries
const chai = require('chai')
const sinon = require('sinon')
const BCHJS = require('@psf/bch-js')

const cloneDeep = require('lodash.clonedeep')

// Locally global variables.
const assert = chai.assert

// Mocking data libraries.
const mockDataLib = require('./mocks/get-mocks')

// Unit under test
const GetLib = require('../../lib/get')
const uut = new GetLib({ bchjs: new BCHJS() })

describe('#create.js', () => {
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
        const _uut = new GetLib({ bchjs: new BCHJS() })
        assert.exists(_uut)
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should throw an error if bch-js is not provided', async () => {
      try {
        // Mock external dependencies.
        const _uut = new GetLib()
        console.log(_uut)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'bch-js instance required')
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
        // Mock external dependencies.
        sandbox
          .stub(uut.bchjs.PsfSlpIndexer, 'tokenStats')
          .throws(new Error('test error'))

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
  describe('#tokenStats', () => {
    it('should return token stats', async () => {
      // Mock external dependencies.
      sandbox
        .stub(uut.bchjs.PsfSlpIndexer, 'tokenStats')
        .resolves(mockData.tokenStats)

      const tokenId = 'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'
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
      assert.property(result, 'txs')
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
          .stub(uut.bchjs.PsfSlpIndexer, 'tokenStats')
          .throws(new Error('test error'))
      } catch (err) {
        assert.include(err.message, 'test error')
      }
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

  describe('#mutableCid', () => {
    it('should return mutable cid from documentHash property', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .onFirstCall().resolves(mockData.decodedOpReturn)
        .onSecondCall().resolves(JSON.parse(mockData.decodedOpReturn)) // data to force an error while parsing the JSON
        .onThirdCall().resolves(JSON.stringify({}))
        .onCall(4).resolves(mockData.decodedOpReturn)

      sandbox
        .stub(uut.bchjs.Electrumx, 'transactions')
        .resolves(mockData.transactions)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)
      assert.isString(result)
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
        .stub(uut.bchjs.Electrumx, 'transactions')
        .resolves(mockData.transactions)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)
      assert.isFalse(result)
    })
    it('should return false if data cant be found', async () => {
      // Mock external dependencies.
      sandbox.stub(uut, 'decodeOpReturn')
        .onFirstCall().resolves(mockData.decodedOpReturn)
        .resolves(null)

      sandbox
        .stub(uut.bchjs.Electrumx, 'transactions')
        .resolves(mockData.transactions)

      const tokenStats = mockData.tokenStats.tokenData
      const result = await uut.mutableCid(tokenStats)
      assert.isFalse(result)
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
        sandbox.stub(uut.bchjs.Electrumx, 'txData').throws(new Error('test error'))
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

    it('should return  data', async () => {
      sandbox.stub(uut.bchjs.Electrumx, 'txData').resolves({ details: mockData.txData.txData })
      const txid = 'c37ba29f40ecc61662ea56324fdb72a5f1e66add2078854c2144765b9030358a'
      const result = await uut.decodeOpReturn(txid)
      assert.isString(result)
    })

    it('should return  false if data is not found', async () => {
      sandbox.stub(uut.bchjs.Electrumx, 'txData').resolves({ details: { vout: [] } })
      const txid = 'c37ba29f40ecc61662ea56324fdb72a5f1e66add2078854c2144765b9030358a'
      const result = await uut.decodeOpReturn(txid)
      assert.isFalse(result)
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

      assert.isObject(result)
    })
  })
})
