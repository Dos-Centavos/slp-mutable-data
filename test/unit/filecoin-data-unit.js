/*
Unit tests for the data.js  library.
*/

// npm libraries
const chai = require('chai')
const sinon = require('sinon')
const web3Storage = require('web3.storage')

const cloneDeep = require('lodash.clonedeep')

// Locally global variables.
const assert = chai.assert

// Mocking data libraries.
const mockDataLib = require('./mocks/filecoin-data-mocks')

// Unit under test
const FilecoinData = require('../../lib/filecoin-data')
const uut = new FilecoinData({ web3Storage })

describe('#data.js', () => {
  let sandbox
  let mockData

  beforeEach(() => {
    // Restore the sandbox before each test.
    sandbox = sinon.createSandbox()

    // Clone the mock data.
    mockData = cloneDeep(mockDataLib)
    uut.Web3Storage = mockData.Web3StorageMock
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should instantiate the class', async () => {
      try {
        // Mock external dependencies.
        const _uut = new FilecoinData({ web3Storage })
        assert.exists(_uut)
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should throw an error if web3Storage is not provided', async () => {
      try {
        // Mock external dependencies.
        const _uut = new FilecoinData({ })
        console.log(_uut)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'Must pass instance of web3.storage library')
      }
    })
  })

  describe('#uploadToFilecoin', () => {
    it('should return cid', async () => {
      const apiKey = 'apiKey'
      const data = { data: 'data' }
      const result = await uut.uploadToFilecoin(data, apiKey)
      assert.isString(result)
    })

    it('should throw an error if apiKey is not provided', async () => {
      try {
        const data = { data: 'data' }
        await uut.uploadToFilecoin(data)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'apiKey needs to contain the API key from web3.storage.')
      }
    })
  })

  describe('#makeFileObjects', () => {
    it('should return files array', async () => {
      const data = { data: 'data' }
      const result = uut.makeFileObjects(data)
      assert.isArray(result)
    })

    it('should handle error', async () => {
      try {
        await uut.makeFileObjects()
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'argument must be of type string or an instance of Buffer')
      }
    })
  })
})
