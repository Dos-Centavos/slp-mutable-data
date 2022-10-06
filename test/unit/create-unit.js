/*
Unit tests for the create.js  library.
*/

// npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const BchWallet = require('minimal-slp-wallet')
const cloneDeep = require('lodash.clonedeep')

const wallet = new BchWallet()

// Mocking data libraries.
const mockDataLib = require('./mocks/create-mocks')

// Unit under test
const CreateLib = require('../../lib/create')
const uut = new CreateLib({ wallet })

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
        const _uut = new CreateLib({ wallet })
        assert.exists(_uut)
      } catch (err) {
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should throw an error if wallet is not provided', async () => {
      try {
        // Mock external dependencies.
        const _uut = new CreateLib()
        console.log(_uut)
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'Instance of minimal-slp-wallet must be passed as wallet when instantiating get.js library.')
      }
    })
  })

  describe('#createMutableTxid', () => {
    it('should create mutable transaction id ', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)
        sandbox
          .stub(uut.wallet.ar, 'sendTx')
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

    it('should handle errors', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)
        sandbox
          .stub(uut.wallet.ar, 'sendTx')
          .rejects(new Error('Test Error'))

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
        assert.include(err.message, 'mda must be a string')
      }
    })

    it('should throw an error if there are not BCH UTXOs to pay for transaction', async () => {
      try {
        // Mock external dependencies.
        mockData.mockUtxos.bchUtxos = []
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos)

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const mspAddr = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'
        await uut.createMutableTxid(WIF, mspAddr)

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'No BCH UTXOs found in wallet')
      }
    })

    it('should create mutable transaction id if fetch utxos is not array type', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos[0])

        sandbox
          .stub(uut.wallet.ar, 'sendTx')
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
  })

  describe('#buildTokenTx', () => {
    it('should build a fungible token by default', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

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
        // console.log(err)
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should build token if fetch utxos is not array type', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos[0])

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

    it('should build token if mint baton is provided', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: 2
        }
        const result = await uut.buildTokenTx(WIF, slpData)
        assert.isString(result)
      } catch (err) {
        console.log(err)
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should build token with destination address', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const destAddress = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'
        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: null
        }
        const result = await uut.buildTokenTx(WIF, slpData, destAddress)
        assert.isString(result)
      } catch (err) {
        console.log(err)
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should build a group token', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const destAddress = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'
        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: null
        }
        const result = await uut.buildTokenTx(WIF, slpData, destAddress, 'group')
        assert.isString(result)
      } catch (err) {
        console.log(err)
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should build an NFT', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const destAddress = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'
        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: null
        }
        const result = await uut.buildTokenTx(WIF, slpData, destAddress, 'nft')
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
          .stub(uut.wallet, 'getUtxos')
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

    it('should throw an error if there are not BCH UTXOs to pay for transaction', async () => {
      try {
        // Mock external dependencies.
        mockData.mockUtxos.bchUtxos = []
        sandbox
          .stub(uut.wallet, 'getUtxos')
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

        await uut.buildTokenTx(WIF, slpData)

        assert.fail('Unexpected code path')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'No BCH UTXOs found in wallet')
      }
    })
  })

  describe('#buildNftTokenTx', () => {
    it('should build an NFT TX', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

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

        const groupId = 'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826'

        const result = await uut.buildNftTokenTx(WIF, slpData, groupId)

        assert.isString(result)
      } catch (err) {
        console.log(err)
        assert.fail('unexpected result')
      }
    })

    it('should build token with destination address', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const destAddress = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'
        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: null
        }

        const groupId = 'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826'

        const result = await uut.buildNftTokenTx(WIF, slpData, groupId, destAddress)
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
          .stub(uut.wallet, 'getUtxos')
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

        const groupId = 'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826'

        const result = await uut.buildNftTokenTx(WIF, slpData, groupId)

        assert.isString(result)
      } catch (err) {
        assert.include(err.message, 'Test Error')
      }
    })

    it('throw error if WIF if not provided', async () => {
      try {
        await uut.buildNftTokenTx()
        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'WIF must be a string')
      }
    })

    it('throw error if token data if not provided', async () => {
      try {
        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'

        await uut.buildNftTokenTx(WIF)

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'slpData must be an object')
      }
    })

    it('throw error if groupId is not provided', async () => {
      try {
        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'

        await uut.buildNftTokenTx(WIF, {})

        assert.equal(true, false, 'unexpected result')
      } catch (err) {
        assert.include(err.message, 'groupId must be a string')
      }
    })

    it('should throw an error if there are not BCH UTXOs to pay for transaction', async () => {
      try {
        // Mock external dependencies.
        mockData.mockUtxos.bchUtxos = []
        sandbox
          .stub(uut.wallet, 'getUtxos')
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

        const groupId = 'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826'

        await uut.buildNftTokenTx(WIF, slpData, groupId)

        assert.fail('Unexpected code path')
      } catch (err) {
        console.log(err)
        assert.include(err.message, 'No BCH UTXOs found in wallet')
      }
    })

    it('should throw an error if there are no Group tokens to consume', async () => {
      try {
        // Mock external dependencies.
        mockData.mockUtxos02.slpUtxos.group.tokens[0].tokenId = 'fakeId'
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

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

        const groupId = 'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826'

        await uut.buildNftTokenTx(WIF, slpData, groupId)

        assert.fail('Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'No token UTXOs for the specified Group token could be found.')
      }
    })
  })

  describe('#createToken', () => {
    it('should create fungible token', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

        sandbox
          .stub(uut.wallet.ar, 'sendTx')
          .resolves(mockData.mockTxId)

        sandbox.stub(uut.bchjs.Util, 'sleep').resolves()

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

    it('should create an NFT', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

        sandbox
          .stub(uut.wallet.ar, 'sendTx')
          .resolves(mockData.mockTxId)

        sandbox.stub(uut.bchjs.Util, 'sleep').resolves()

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

        const groupId = 'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826'

        const result = await uut.createToken(WIF, slpData, mspAddr, undefined, 'nft', groupId)

        assert.isString(result)
      } catch (err) {
        console.log(err)
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should create token with mint baton', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)
        sandbox
          .stub(uut.wallet.ar, 'sendTx')
          .resolves(mockData.mockTxId)

        sandbox.stub(uut.bchjs.Util, 'sleep').resolves()

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const mspAddr = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'

        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: 2
        }

        const result = await uut.createToken(WIF, slpData, mspAddr)

        assert.isString(result)
      } catch (err) {
        console.log(err)
        assert.equal(true, false, 'unexpected result')
      }
    })

    it('should create token with destination address', async () => {
      try {
        // Mock external dependencies.
        sandbox
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)
        sandbox
          .stub(uut.wallet.ar, 'sendTx')
          .resolves(mockData.mockTxId)

        sandbox.stub(uut.bchjs.Util, 'sleep').resolves()

        const WIF = 'KxseNvKfKdMRgrMuWS5SZWHs8pjev6qJ29z9k7i5zqUDbESvxdnu'
        const mspAddr = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'
        const destAddress = 'bitcoincash:qznchwd2rd2vskd4leewdah4wcjgkv33eqss59vhv6'

        const slpData = {
          name: 'SLP Test Token',
          ticker: 'SLPTEST',
          documentUrl: 'https://FullStack.cash',
          decimals: 0,
          initialQty: 1,
          documentHash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
          mintBatonVout: null
        }
        const result = await uut.createToken(WIF, slpData, mspAddr, destAddress)
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
          .stub(uut.wallet, 'getUtxos')
          .resolves(mockData.mockUtxos02)

        sandbox
          .stub(uut.wallet.ar, 'sendTx')
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
})
