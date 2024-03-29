/*
This library contains mocking data for running get library unit test.
*/

'use strict'
const mda = 'bitcoincash:qpegq32ddlaj09grkkq7xsfyc5j8kfl3ygpj2zqmsv'

const tokenStats = {
  tokenData: {
    type: 1,
    ticker: 'TP03',
    name: 'Test Plugin 03',
    tokenId: '13cad617d523c8eb4ab11fff19c010e0e0a4ea4360b58e0c8c955a45a146a669',
    documentUri: 'fullstack.cash',
    documentHash: 'i\u0004���3��s\u0003�tz}�/��P�ǚ�Z>T��)��',
    decimals: 0,
    mintBatonIsActive: false,
    tokensInCirculationBN: '1',
    tokensInCirculationStr: '1',
    blockCreated: 722420,
    totalBurned: '0',
    totalMinted: '1',
    txs: [
      {
        txid: '13cad617d523c8eb4ab11fff19c010e0e0a4ea4360b58e0c8c955a45a146a669',
        height: 722420,
        type: 'GENESIS',
        qty: '1'
      }
    ]
  }
}

const tokenStats02 = {
  genesisData: {
    type: 1,
    ticker: 'MT2',
    name: 'Mutable Token',
    tokenId: 'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d',
    documentUri: 'ipfs://bafybeie7oxpsr7evcnlptecxfdhaqlot4732phukd2ekgvuzoir2frost4',
    documentHash: '56ed1a5768076a318d02b5db64e125544dca57ab6b2cc7ca61dfa4645d244463',
    decimals: 0,
    mintBatonIsActive: true,
    tokensInCirculationBN: '1000',
    tokensInCirculationStr: '1000',
    blockCreated: 739413,
    totalBurned: '0',
    totalMinted: '1000'
  },
  immutableData: 'ipfs://bafybeie7oxpsr7evcnlptecxfdhaqlot4732phukd2ekgvuzoir2frost4',
  mutableData: 'ipfs://bafybeigotuony53ley3n63hqwyxiqruqn5uamskmci6f645putnc46jju4'
}

const txData = {
  txData: {
    txid: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    hash: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    version: 2,
    size: 339,
    locktime: 0,
    vin: [
      {
        txid: '8370db30d94761ab9a11b71ecd22541151bf6125c8c613f0f6fab8ab794565a7',
        vout: 0,
        scriptSig: {
          asm: '304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4[ALL|FORKID] 02791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851',
          hex: '47304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4412102791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851'
        },
        sequence: 4294967295,
        value: 0.00051303,
        tokenQty: 0,
        tokenQtyStr: '0',
        tokenId: null
      }
    ],
    vout: [
      {
        value: 0,
        n: 0,
        scriptPubKey: {
          asm: 'OP_RETURN 5262419 1 47454e45534953 54524f5554 54726f75742773207465737420746f6b656e 74726f757473626c6f672e636f6d 0 2 2 000000174876e800',
          hex: '6a04534c500001010747454e455349530554524f55541254726f75742773207465737420746f6b656e0e74726f757473626c6f672e636f6d4c000102010208000000174876e800',
          type: 'nulldata'
        },
        tokenQtyStr: '0',
        tokenQty: 0
      }
    ],
    hex: '0200000001a7654579abb8faf6f013c6c82561bf51115422cd1eb7119aab6147d930db7083000000006a47304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4412102791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851ffffffff040000000000000000476a04534c500001010747454e455349530554524f55541254726f75742773207465737420746f6b656e0e74726f757473626c6f672e636f6d4c000102010208000000174876e80022020000000000001976a914db4d39ceb7794ffe5d06855f249e1d3a7f1b024088ac22020000000000001976a914db4d39ceb7794ffe5d06855f249e1d3a7f1b024088accec20000000000001976a9145904159f2f69bfa63eefa712633a0d96dc2e7e8888ac00000000',
    blockhash: '0000000000000000009f65225a3e12e23a7ea057c869047e0f36563a1f410267',
    confirmations: 97398,
    time: 1581773131,
    blocktime: 1581773131,
    blockheight: 622414,
    isSlpTx: true,
    tokenTxType: 'GENESIS',
    tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    tokenType: 1,
    tokenTicker: 'TROUT',
    tokenName: "Trout's test token",
    tokenDecimals: 2,
    tokenUri: 'troutsblog.com',
    tokenDocHash: '',
    isValidSlp: true
  }
}

const txData02 = [
  {
    txid: '154cc735206f8401f293a0792a77c3730325e78281de6b6edeb983eb71a91c5f',
    hash: '154cc735206f8401f293a0792a77c3730325e78281de6b6edeb983eb71a91c5f',
    version: 2,
    size: 279,
    locktime: 0,
    vin: [
      {
        txid: '724727bd619ceb4031cc4147ff6bdee2d178bc0c43222598f5a71a4d36e4e143',
        vout: 0,
        scriptSig: {
          asm: '30440220110f0805772b5b65dfd617bcc98303bf6e41182e4e3fec4840baecced0888f4f02205ed50d614894a3119a29b20ed10acb83cdcdf9fe1feffc08993cd58cb0b77a8e[ALL|FORKID] 027c43656d6907c5af5296cd4817a23983124d54b8b8c7d63426b891d68868a06e',
          hex: '4730440220110f0805772b5b65dfd617bcc98303bf6e41182e4e3fec4840baecced0888f4f02205ed50d614894a3119a29b20ed10acb83cdcdf9fe1feffc08993cd58cb0b77a8e4121027c43656d6907c5af5296cd4817a23983124d54b8b8c7d63426b891d68868a06e'
        },
        sequence: 4294967295,
        address: 'bitcoincash:qplnej5md740lkl6qt0qf0g2mkv7dwfscskjask5s8',
        value: 0.00043081
      }
    ],
    vout: [
      {
        value: 0,
        n: 0,
        scriptPubKey: {
          asm: 'OP_RETURN 7b22636964223a22697066733a2f2f62616679626569676f74756f6e7935336c6579336e3633687177797869717275716e3575616d736b6d636936663634357075746e6334366a6a7534227d',
          hex: '6a4c4c7b22636964223a22697066733a2f2f62616679626569676f74756f6e7935336c6579336e3633687177797869717275716e3575616d736b6d636936663634357075746e6334366a6a7534227d',
          type: 'nulldata'
        }
      },
      {
        value: 0.00042031,
        n: 1,
        scriptPubKey: {
          asm: 'OP_DUP OP_HASH160 7f3cca9b6faaffdbfa02de04bd0add99e6b930c4 OP_EQUALVERIFY OP_CHECKSIG',
          hex: '76a9147f3cca9b6faaffdbfa02de04bd0add99e6b930c488ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: [
            'bitcoincash:qplnej5md740lkl6qt0qf0g2mkv7dwfscskjask5s8'
          ]
        }
      }
    ],
    hex: '020000000143e1e4364d1aa7f5982522430cbc78d1e2de6bff4741cc3140eb9c61bd274772000000006a4730440220110f0805772b5b65dfd617bcc98303bf6e41182e4e3fec4840baecced0888f4f02205ed50d614894a3119a29b20ed10acb83cdcdf9fe1feffc08993cd58cb0b77a8e4121027c43656d6907c5af5296cd4817a23983124d54b8b8c7d63426b891d68868a06effffffff0200000000000000004f6a4c4c7b22636964223a22697066733a2f2f62616679626569676f74756f6e7935336c6579336e3633687177797869717275716e3575616d736b6d636936663634357075746e6334366a6a7534227d2fa40000000000001976a9147f3cca9b6faaffdbfa02de04bd0add99e6b930c488ac00000000',
    blockhash: '00000000000000000484c6a139dcaaa5b9047092bb1d14142d6d197dba561070',
    confirmations: 17771,
    time: 1652121096,
    blocktime: 1652121096,
    isValidSlp: false
  }
]

const transactions = {
  success: true,
  transactions: [
    {
      height: 734439,
      tx_hash: '0bd2a8a72108659cd39a59bde89c45fff7d51c334531f036b1e102ab4b62f33f'
    },
    {
      height: 734441,
      tx_hash: '4f2837b7fff325c0442b550863de3470e016df234561d9151cbb6949fe43ac17'
    },
    {
      height: 735564,
      tx_hash: '1bfa83355839c0ef0f974463415fa983466e0286d7bcdfdd825f244e357ad1e5'
    },
    {
      height: 735564,
      tx_hash: '6eba09627175af4b50ac75fa8b3a15a9015df8a19b5b28a992f26044f4fd8891'
    },
    {
      height: 735564,
      tx_hash: 'c37ba29f40ecc61662ea56324fdb72a5f1e66add2078854c2144765b9030358a'
    }]
}

const transactions02 = [
  {
    height: 739414,
    tx_hash: '154cc735206f8401f293a0792a77c3730325e78281de6b6edeb983eb71a91c5f'
  },
  {
    height: 739413,
    tx_hash: '56ed1a5768076a318d02b5db64e125544dca57ab6b2cc7ca61dfa4645d244463'
  },
  {
    height: 739413,
    tx_hash: '724727bd619ceb4031cc4147ff6bdee2d178bc0c43222598f5a71a4d36e4e143'
  }
]

const transactions03 = [
  {
    height: 762681,
    tx_hash: '67edcf3e45c64ce6829cd3e53484e08fe8a6b9f0b0bc0a202f0cd3123d9177a8'
  },
  {
    height: 762681,
    tx_hash: '7588959fbd2f1baf86a5bd27616a96e103bcd89d25affee46f1e8c67b96881a6'
  },
  {
    height: 762678,
    tx_hash: '54d4bfe9ef8dd7a0a7fe6091499ac9a80a63b4cf3657757665b1af8154477972'
  }
]

const immutableData = {
  payloadCid: 'QmY3EaRaUcc5bNuqDfc7TaeNPThBGUefbqJeJVDjCqxqFZ',
  about: 'This is a placeholder'
}
const mutableData = {
  tokenIcon: 'https://gateway.ipfs.io/ipfs/bafybeiehitanirn5gmhqjg44xrmdtomn4n5lu5yjoepsvgpswk5mggaw6i/LP_logo-1.png',
  about: 'Mutable data managed with npm package: https://www.npmjs.com/package/slp-mutable-data'
}

const decodedOpReturn = JSON.stringify({
  mda,
  cid: 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'
})

// bchjs.RawTransactions.getTxData() Mocks
const txDataWithMDA = {
  txData: {
    txid: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    hash: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    version: 2,
    size: 339,
    locktime: 0,
    vin: [
      {
        txid: '8370db30d94761ab9a11b71ecd22541151bf6125c8c613f0f6fab8ab794565a7',
        vout: 0,
        scriptSig: {
          asm: '304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4[ALL|FORKID] 02791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851',
          hex: '47304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4412102791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851'
        },
        sequence: 4294967295,
        address: mda,
        value: 0.00051303,
        tokenQty: 0,
        tokenQtyStr: '0',
        tokenId: null
      }
    ],
    vout: [
      {
        value: 0,
        n: 0,
        scriptPubKey: {
          asm: 'OP_RETURN 5262419 1 47454e45534953 54524f5554 54726f75742773207465737420746f6b656e 74726f757473626c6f672e636f6d 0 2 2 000000174876e800',
          hex: '6a04534c500001010747454e455349530554524f55541254726f75742773207465737420746f6b656e0e74726f757473626c6f672e636f6d4c000102010208000000174876e800',
          type: 'nulldata'
        },
        tokenQtyStr: '0',
        tokenQty: 0
      }
    ],
    hex: '0200000001a7654579abb8faf6f013c6c82561bf51115422cd1eb7119aab6147d930db7083000000006a47304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4412102791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851ffffffff040000000000000000476a04534c500001010747454e455349530554524f55541254726f75742773207465737420746f6b656e0e74726f757473626c6f672e636f6d4c000102010208000000174876e80022020000000000001976a914db4d39ceb7794ffe5d06855f249e1d3a7f1b024088ac22020000000000001976a914db4d39ceb7794ffe5d06855f249e1d3a7f1b024088accec20000000000001976a9145904159f2f69bfa63eefa712633a0d96dc2e7e8888ac00000000',
    blockhash: '0000000000000000009f65225a3e12e23a7ea057c869047e0f36563a1f410267',
    confirmations: 97398,
    time: 1581773131,
    blocktime: 1581773131,
    blockheight: 622414,
    isSlpTx: true,
    tokenTxType: 'GENESIS',
    tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    tokenType: 1,
    tokenTicker: 'TROUT',
    tokenName: "Trout's test token",
    tokenDecimals: 2,
    tokenUri: 'troutsblog.com',
    tokenDocHash: '',
    isValidSlp: true
  }
}

// bchjs.RawTransactions.getTxData() Mocks
const txDataWithoutMDA = {
  txData: {
    txid: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    hash: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    version: 2,
    size: 339,
    locktime: 0,
    vin: [
      {
        txid: '8370db30d94761ab9a11b71ecd22541151bf6125c8c613f0f6fab8ab794565a7',
        vout: 0,
        scriptSig: {
          asm: '304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4[ALL|FORKID] 02791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851',
          hex: '47304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4412102791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851'
        },
        sequence: 4294967295,
        address: 'bitcoincash:qpvsg9vl9a5mlf37a7n3yce6pktdctn73qwgaqm3wq',
        value: 0.00051303,
        tokenQty: 0,
        tokenQtyStr: '0',
        tokenId: null
      }
    ],
    vout: [
      {
        value: 0,
        n: 0,
        scriptPubKey: {
          asm: 'OP_RETURN 5262419 1 47454e45534953 54524f5554 54726f75742773207465737420746f6b656e 74726f757473626c6f672e636f6d 0 2 2 000000174876e800',
          hex: '6a04534c500001010747454e455349530554524f55541254726f75742773207465737420746f6b656e0e74726f757473626c6f672e636f6d4c000102010208000000174876e800',
          type: 'nulldata'
        },
        tokenQtyStr: '0',
        tokenQty: 0
      }
    ],
    hex: '0200000001a7654579abb8faf6f013c6c82561bf51115422cd1eb7119aab6147d930db7083000000006a47304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4412102791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851ffffffff040000000000000000476a04534c500001010747454e455349530554524f55541254726f75742773207465737420746f6b656e0e74726f757473626c6f672e636f6d4c000102010208000000174876e80022020000000000001976a914db4d39ceb7794ffe5d06855f249e1d3a7f1b024088ac22020000000000001976a914db4d39ceb7794ffe5d06855f249e1d3a7f1b024088accec20000000000001976a9145904159f2f69bfa63eefa712633a0d96dc2e7e8888ac00000000',
    blockhash: '0000000000000000009f65225a3e12e23a7ea057c869047e0f36563a1f410267',
    confirmations: 97398,
    time: 1581773131,
    blocktime: 1581773131,
    blockheight: 622414,
    isSlpTx: true,
    tokenTxType: 'GENESIS',
    tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    tokenType: 1,
    tokenTicker: 'TROUT',
    tokenName: "Trout's test token",
    tokenDecimals: 2,
    tokenUri: 'troutsblog.com',
    tokenDocHash: '',
    isValidSlp: true
  }
}

const txDataWithoutMDA02 = [{

  txid: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
  hash: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
  version: 2,
  size: 339,
  locktime: 0,
  vin: [
    {
      txid: '8370db30d94761ab9a11b71ecd22541151bf6125c8c613f0f6fab8ab794565a7',
      vout: 0,
      scriptSig: {
        asm: '304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4[ALL|FORKID] 02791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851',
        hex: '47304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4412102791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851'
      },
      sequence: 4294967295,
      address: 'bitcoincash:qpvsg9vl9a5mlf37a7n3yce6pktdctn73qwgaqm3wq',
      value: 0.00051303,
      tokenQty: 0,
      tokenQtyStr: '0',
      tokenId: null
    }
  ],
  vout: [
    {
      value: 0,
      n: 0,
      scriptPubKey: {
        asm: 'OP_RETURN 5262419 1 47454e45534953 54524f5554 54726f75742773207465737420746f6b656e 74726f757473626c6f672e636f6d 0 2 2 000000174876e800',
        hex: '6a04534c500001010747454e455349530554524f55541254726f75742773207465737420746f6b656e0e74726f757473626c6f672e636f6d4c000102010208000000174876e800',
        type: 'nulldata'
      },
      tokenQtyStr: '0',
      tokenQty: 0
    }
  ],
  hex: '0200000001a7654579abb8faf6f013c6c82561bf51115422cd1eb7119aab6147d930db7083000000006a47304402207e9631c53dfc8a9a793d1916469628c6b7c5780c01c2f676d51ef21b0ba4926f022069feb471ec869a49f8d108d0aaba04e7cd36e60a7500109d86537f55698930d4412102791b19a39165dbd83403d6df268d44fd621da30581b0b6e5cb15a7101ed58851ffffffff040000000000000000476a04534c500001010747454e455349530554524f55541254726f75742773207465737420746f6b656e0e74726f757473626c6f672e636f6d4c000102010208000000174876e80022020000000000001976a914db4d39ceb7794ffe5d06855f249e1d3a7f1b024088ac22020000000000001976a914db4d39ceb7794ffe5d06855f249e1d3a7f1b024088accec20000000000001976a9145904159f2f69bfa63eefa712633a0d96dc2e7e8888ac00000000',
  blockhash: '0000000000000000009f65225a3e12e23a7ea057c869047e0f36563a1f410267',
  confirmations: 97398,
  time: 1581773131,
  blocktime: 1581773131,
  blockheight: 622414,
  isSlpTx: true,
  tokenTxType: 'GENESIS',
  tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
  tokenType: 1,
  tokenTicker: 'TROUT',
  tokenName: "Trout's test token",
  tokenDecimals: 2,
  tokenUri: 'troutsblog.com',
  tokenDocHash: '',
  isValidSlp: true

}]

const cid = 'bafybeie6t5uyupddc7azms737xg4hxrj7i5t5ov3lb5g2qeehaujj6ak64'

module.exports = {
  tokenStats,
  tokenStats02,
  txData,
  txData02,
  txDataWithMDA,
  txDataWithoutMDA,
  txDataWithoutMDA02,
  transactions,
  transactions02,
  transactions03,
  immutableData,
  mutableData,
  decodedOpReturn,
  cid
}
