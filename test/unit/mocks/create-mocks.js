/*
  A mocking library for create.js unit tests.
  A mocking library contains data to use in place of the data that would come
  from an external dependency.
*/

'use strict'

const mockUtxos = [
  {
    bchUtxos: [
      {
        height: 0,
        tx_hash: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
        tx_pos: 3,
        value: 13902,
        txid: 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831',
        vout: 3,
        isValid: false,
        satoshis: 13902
      }

    ]
  }
]

const mockTxId = 'ec1d3c080759dfc7a5e29e5132230c2359aff2024d68ddf0ae1ba41c9e234831'

module.exports = {
  mockUtxos,
  mockTxId
}
