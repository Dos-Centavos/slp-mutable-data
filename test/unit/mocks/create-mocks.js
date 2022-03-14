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

const mockUtxos02 = {
  address: 'bitcoincash:qqc3pqztxxcq7hr5g7f5us477rhxl96m65lp7cszfl',
  bchUtxos: [
    {
      height: 0,
      tx_hash: '8f1b9d921c02c63826bb287a50c9561bc5ee44c9e17e83c63e9bfc42f331a0e6',
      tx_pos: 3,
      value: 335680,
      txid: '8f1b9d921c02c63826bb287a50c9561bc5ee44c9e17e83c63e9bfc42f331a0e6',
      vout: 3,
      address: 'bitcoincash:qqc3pqztxxcq7hr5g7f5us477rhxl96m65lp7cszfl',
      isSlp: false
    }
  ],
  slpUtxos: {
    type1: {
      tokens: [
        {
          height: 715677,
          tx_hash: 'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826',
          tx_pos: 1,
          value: 546,
          txid: 'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826',
          vout: 1,
          isSlp: true,
          type: 'token',
          qty: '1',
          tokenId: 'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826',
          address: 'bitcoincash:qqc3pqztxxcq7hr5g7f5us477rhxl96m65lp7cszfl',
          ticker: 'MT01',
          name: 'Mutable Test 01',
          documentUri: 'https://FullStack.cash',
          documentHash: '��\u001bu�Ȱ�Ρ��:�\u0013����K�q�V\u001c�\r+:���',
          decimals: 0,
          qtyStr: '1'
        }
      ],
      mintBatons: []
    },
    nft: {}
  },
  nullUtxos: []
}

module.exports = {
  mockUtxos,
  mockTxId,
  mockUtxos02
}
