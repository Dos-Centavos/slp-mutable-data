/*
Unit tests for the create.js  library.
*/

// npm libraries
const chai = require('chai')
const sinon = require('sinon')
const BCHJS = require('@psf/bch-js')

const cloneDeep = require('lodash.clonedeep')

// Locally global variables.
const assert = chai.assert

// Mocking data libraries.
const mockDataLib = require('./mocks/create-mocks')

// Unit under test
const CreateLib = require('../../lib/create')
const uut = new CreateLib({ bchjs: new BCHJS() })

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
  describe('#Create', () => {
    it('should instantiate the class', async () => {
      try {
        // Mock external dependencies.
        const _uut = new CreateLib({ bchjs: new BCHJS() })
        assert.exists(_uut)
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })
    it('should throw an error if bch-js is not provided', async () => {
      try {
        // Mock external dependencies.
        const _uut = new CreateLib()
        console.log(_uut)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'bch-js instance required')
      }
    })
  })
  describe('#createToken', () => {
    it('should create token', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.bchjs.Utxo, 'get')
          .resolves(mockData.mockUtxos)

        sandbox
          .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
          .resolves(mockData.mockTxId)

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const mspAddr = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'

        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: null
        }
        const result = await uut.createToken(WIF, slpData, mspAddr)
        assert.isString(result)
      } catch (err) {
        console.log(err)
        assert.equal(true, false, 'unexpected result')
      }
    })
    it('should handle errors', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.bchjs.Utxo, 'get')
          .resolves(mockData.mockUtxos)

        sandbox
          .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
          .throws(new Error('Test Error'))

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const mspAddr = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'

        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: null
        }
        const result = await uut.createToken(WIF, slpData, mspAddr)
        assert.isString(result)
      } catch (err) {
        assert.include(err.message, 'Test Error')
      }
    })
  })
  describe('#buildTokenTx', () => {
    it('should build token', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.bchjs.Utxo, 'get')
          .resolves(mockData.mockUtxos)

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: null
        }
        const result = await uut.buildTokenTx(WIF, slpData)
        assert.isString(result)
      } catch (err) {
        console.log(err)
        assert.equal(true, false, 'unexpected result')
      }
    })
    it('should handle errors', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.bchjs.Utxo, 'get')
          .throws(new Error('Test Error'))

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: null
        }
        const result = await uut.buildTokenTx(WIF, slpData)
        assert.isString(result)
      } catch (err) {
        assert.include(err.message, 'Test Error')
      }
    })
    it('throw error if WIF if not provided', async () => {
      try {
        await uut.buildTokenTx()
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'WIF must be a string')
      }
    })
    it('throw error if token data if not provided', async () => {
      try {
        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'

        await uut.buildTokenTx(WIF)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'slpData must be an object')
      }
    })
  })
  describe('#createMutableTxid', () => {
    it('should create mutable transaction id ', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.bchjs.Utxo, 'get')
          .resolves(mockData.mockUtxos)

        sandbox
          .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
          .resolves(mockData.mockTxId)

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const mspAddr = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'
        const result = await uut.createMutableTxid(WIF, mspAddr)
        assert.isString(result)
      } catch (err) {
        console.log(err)
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should handle erros ', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.bchjs.Utxo, 'get')
          .resolves(mockData.mockUtxos)

        sandbox
          .stub(uut.bchjs.RawTransactions, 'sendRawTransaction')
          .throws(new Error('Test Error'))

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const mspAddr = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'
        const result = await uut.createMutableTxid(WIF, mspAddr)
        assert.isString(result)
      } catch (err) {
        assert.include(err.message, 'Test Error')
      }
    })

    it('throw error if WIF if not provided', async () => {
      try {
        await uut.createMutableTxid()
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'WIF must be a string')
      }
    })
    it('throw error if mspAddress if not provided', async () => {
      try {
        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        await uut.createMutableTxid(WIF)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'mspAddr must be a string')
      }
    })
  })
})
