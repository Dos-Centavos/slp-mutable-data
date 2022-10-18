/*
  An example for updating the mutable data associated with a token.

  This follows section 6 of PS002 specification:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps002-slp-mutable-data.md#6-update-mutable-data
*/

// Replace this with your own WIF private key.
const mdaWif = 'KxP3S56Tcn7sEncgozp4kpGvnUK5Gy6dEtfjteAe8SiPdB7RTJoy'
// const mda = 'bitcoincash:qr9czk5ullqpcq250n0x2dy73vu3wedmmyjstg4km6'
// mnemonic: husband cook purpose dream obscure legal exotic book quote bulk need cabbage

// This CID is generated from 01-create-data.js. Replace it with your own CID.
const mutableCid = 'bafybeifn4wooos4ifozveyam6b3h6wbfc62wrbihry43rfex3emyzkjrre'

// Local libraries
const { SlpMutableData } = require('../index')
// const SlpMutableData = require('slp-mutable-data')

// Global npm libraries
const BchWallet = require('minimal-slp-wallet')

async function updateMutableData () {
  try {
    const wallet = new BchWallet(mdaWif, { interface: 'consumer-api' })
    await wallet.walletInfoPromise
    await wallet.initialize()

    const slpMutableData = new SlpMutableData({ wallet })

    const cidStr = `ipfs://${mutableCid}`

    const hex = await slpMutableData.data.writeCIDToOpReturn(cidStr, mdaWif)

    // Broadcast transaction to the network
    const txid = await wallet.ar.sendTx(hex)

    console.log(`TXID for updated CID: ${txid}`)
    console.log(`https://blockchair.com/bitcoin-cash/transaction/${txid}`)
  } catch (err) {
    console.error(err)
  }
}
updateMutableData()
