/*
This library contains mocking data for running data library unit test.
*/

'use strict'

const cid = 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'
const mockUtxos = {
  bchUtxos: [
    {
      height: 0,
      tx_hash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
      tx_pos: 3,
      value: 1,
      txid: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
      vout: 3,
      isValid: false,
      satoshis: 1
    }

  ]
}

const mockTxId = 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831'

const mockUtxos02 = {
  address: 'bitcoincash:qpegq32ddlaj09grkkq7xsfyc5j8kfl3ygpj2zqmsv',
  bchUtxos: [
    {
      height: 736280,
      tx_hash: 'edc5861cf6aefb7b6bd2657889e9c0adc26d21c0c9f1511cb35122c5af9468ff',
      tx_pos: 1,
      value: 546,
      txid: 'edc5861cf6aefb7b6bd2657889e9c0adc26d21c0c9f1511cb35122c5af9468ff',
      vout: 1,
      address: 'bitcoincash:qpegq32ddlaj09grkkq7xsfyc5j8kfl3ygpj2zqmsv',
      isSlp: false
    },
    {
      height: 736288,
      tx_hash: '6a080ce72c88cbc601f8fadc61cb10e9b186e74ad9fa42a3f1c955e1275cc12f',
      tx_pos: 1,
      value: 546,
      txid: '6a080ce72c88cbc601f8fadc61cb10e9b186e74ad9fa42a3f1c955e1275cc12f',
      vout: 1,
      address: 'bitcoincash:qpegq32ddlaj09grkkq7xsfyc5j8kfl3ygpj2zqmsv',
      isSlp: false
    },
    {
      height: 736289,
      tx_hash: '2511f68abde15eb913895d18bc8d55367db8f89ab10301c90b49af1193125611',
      tx_pos: 1,
      value: 12599,
      txid: '2511f68abde15eb913895d18bc8d55367db8f89ab10301c90b49af1193125611',
      vout: 1,
      address: 'bitcoincash:qpegq32ddlaj09grkkq7xsfyc5j8kfl3ygpj2zqmsv',
      isSlp: false
    }
  ],
  slpUtxos: { type1: { tokens: [], mintBatons: [] }, nft: {} },
  nullUtxos: []
}

class Web3StorageMock {
  put () {
    return cid
  }
}
module.exports = {
  cid,
  mockTxId,
  mockUtxos,
  mockUtxos02,
  Web3StorageMock
}
