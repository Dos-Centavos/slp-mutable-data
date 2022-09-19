/*
Unit tests for the data.js  library.
*/

// npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const BchWallet = require('minimal-slp-wallet/index')
const cloneDeep = require('lodash.clonedeep')

// Mocking data libraries.
const mockDataLib = require('./mocks/data-mocks')

const wallet = new BchWallet()

// Unit under test
const Data = require('../../lib/data')
const uut = new Data({ wallet })

describe('#data.js', () => {
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
      // Mock external dependencies.
      const _uut = new Data({ wallet })
      assert.exists(_uut)
    })

    it('should throw an error if wallet is not provided', async () => {
      try {
        // Mock external dependencies.
        const _uut = new Data()
        console.log(_uut)

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'Instance of minimal-slp-wallet must be passed as wallet when instantiating this library.')
      }
    })

    it('should overwrite servers if user specifies them', async () => {
      // Mock external dependencies.
      const _uut = new Data({ wallet, serverURL: 'server1', pinServer: 'server2' })

      assert.equal(_uut.serverURL, 'server1')
      assert.equal(_uut.pinServer, 'server2')
    })
  })

  describe('#writeCIDToOpReturn', () => {
    it('should build transaction', async () => {
      // Mock external dependencies.
      sandbox
        .stub(uut.wallet, 'getUtxos')
        .resolves(mockData.mockUtxos02)

      const cid = mockData.cid
      const result = await uut.writeCIDToOpReturn(cid)
      assert.isString(result)
    })

    it('should throw an error if cid is not provided', async () => {
      try {
        await uut.writeCIDToOpReturn(null)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'CID of IPFS or Filecoin data required')
      }
    })

    it('should throw an error if there are no BCH UTXOs to pay for transaction', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos)

        const cid = mockData.cid

        await uut.writeCIDToOpReturn(cid)

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'not big enough')
      }
    })
  })

  describe('#writeJsonToP2wdb', () => {
    it('should upload JSON to P2WDB and return the zcid', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut.wallet, 'initialize').resolves()
      sandbox.stub(uut.write, 'postEntry').resolves({ hash: 'fake-hash' })

      const inObj = {
        foo: 'bar'
      }

      const result = await uut.writeJsonToP2wdb(inObj)

      assert.equal(result, 'fake-hash')
    })

    it('should catch random errors and throw them', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut.wallet, 'initialize').rejects(new Error('test error'))

      try {
        await uut.writeJsonToP2wdb()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#pinJson', () => {
    it('should pin P2WDB entry and return the CID', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut.wallet, 'initialize').resolves()
      sandbox.stub(uut.pin, 'json').resolves('fake-cid')
      sandbox.stub(uut.pin, 'cid').resolves({ hash: 'fake-hash' })

      const inObj = {
        zcid: 'fake-zcid'
      }

      const { ipfsCid, p2wdbPinCid } = await uut.pinJson(inObj)

      assert.equal(ipfsCid, 'fake-cid')
      assert.equal(p2wdbPinCid, 'fake-hash')
    })

    it('should catch random errors and throw them', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut.wallet, 'initialize').rejects(new Error('test error'))

      try {
        await uut.pinJson({ zcid: 'fake-zcid' })

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  // describe('#loadRetryQueueLib', () => {
  //   it('should load the retry-queue library', async () => {
  //     await uut.loadRetryQueueLib()
  //     // console.log(uut.retryQueue)
  //
  //     assert.equal(uut.retryQueue.attempts, 3)
  //   })
  // })

  describe('#createTokenData', () => {
    it('should create token data and return the CID', async () => {
      // Mock dependencies and force desired code path
      uut.retryQueue = { addToQueue: async () => {} }
      // sandbox.stub(uut, 'loadRetryQueueLib').resolves()
      sandbox.stub(uut.retryQueue, 'addToQueue')
        .onCall(0).resolves('fake-zcid')
        .onCall(1).resolves({ ipfsCid: 'fake-cid', p2wdbPinCid: 'fake-zcid2' })

      const inObj = {
        foo: 'bar'
      }

      const result = await uut.createTokenData(inObj)

      assert.equal(result, 'fake-cid')
    })

    it('should catch random errors and throw them', async () => {
      // Mock dependencies and force desired code path
      sandbox.stub(uut.retryQueue, 'addToQueue').rejects(new Error('test error'))

      try {
        await uut.createTokenData()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })
})
