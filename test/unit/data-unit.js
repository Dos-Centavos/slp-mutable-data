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
      try {
        // Mock external dependencies.
        const _uut = new Data({ wallet })
        assert.exists(_uut)
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
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
})
