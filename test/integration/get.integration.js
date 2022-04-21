/*
  Integration tests for the get.js library.
*/

// Public NPM libraries
const BCHJS = require('@psf/bch-js')
const assert = require('chai').assert

// Local libraries
const Get = require('../../lib/get')

const bchjs = new BCHJS()
const uut = new Get({ bchjs })

describe('#get', () => {
  it('should get data on fugible token with no mutable or immutable data', async () => {
    const tokenId = '2624df798d76986231c7acb0f6923f537223da44ba6e25171186ab4056a58b64'

    const result = await uut.data(tokenId)
    // console.log('result: ', result)

    assert.deepEqual(result.immutableData, {})
    assert.deepEqual(result.mutableData, {})
    assert.equal(result.tokenStats.ticker, 'JOY')
  })

  it('should get data on legacy NFT', async () => {
    const tokenId = '6eaba31ab00a571dc3c01ad88070b403d8e15eb119154931bc697cb256b9f307'

    const result = await uut.data(tokenId)
    // console.log('result: ', result)

    assert.deepEqual(result.immutableData, {})
    assert.deepEqual(result.mutableData, {})
    assert.equal(result.tokenStats.ticker, 'SWEDC')
  })

  it('should get data token following PS002 spec', async () => {
    const tokenId = 'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'

    const result = await uut.data(tokenId)
    // console.log('result: ', result)

    assert.equal(result.immutableData.website, 'http://launchpadip.com/')
    assert.include(result.mutableData.about, 'Mutable data managed')
    assert.equal(result.tokenStats.ticker, 'MT01')
  })

  it('should get data token with mutable, but not immutable data', async () => {
    const tokenId = '0c9caad8abde15a985c84ed6df14cb8e39c6583d8c50373d1660d0cf03081bea'

    const result = await uut.data(tokenId)
    // console.log('result: ', result)

    assert.deepEqual(result.immutableData, {})
    assert.include(result.mutableData.about, 'Mutable data managed')
    assert.equal(result.tokenStats.ticker, 'MT01')
  })
})
