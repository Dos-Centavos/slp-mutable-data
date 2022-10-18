/*
  Run this script second to upload the mutable data for your new
  token to IPFS.

  This example script shows how to create mutable data for a
  new token. This data is stored in JSON and uploaded to IPFS. The content
  ID (CID) is returned and can be used when creating the token.

  Token data should comply with the PS007 specification for token data:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps007-token-data-schema.md
*/

// Customize these objects for your own token. These objects will be converted
// to JSON and uploaded to IPFS.
const mutableData = {
  schema: 'ps007-v1.0.1',
  tokenIcon: 'https://bafybeicvlcwv3flrwa4egmroyicvghevi6uzbd56drmoerjeguu4ikpnhe.ipfs.dweb.link/psf-logo.png',
  fullSizedUrl: '',
  nsfw: false,
  userData: '',
  jsonLd: {},
  about: 'This NFT was created using the PSF Token Studio at https://nft-creator.fullstack.cash',
  category: 'text',
  tags: [
    'example',
    'token'
  ],
  mediaType: 'image',
  currentOwner: {}
}

// Key pair for creating and holding the token. Also used to pay for upload of
// data to IPFS.
const walletWif = 'L1XkvKux3hB49W6ChqPuX1CPhkM9cSvAFZoGgZ7EZa4poaqPtQb9'
// 'bitcoincash:qz3fhj6yf9t4fs7fl3pgvg890teyd2ks9uhc4hu6wc'
// mnemonic: famous squeeze provide slice become august cigar symptom cream else start garage

// Global npm libraries
const BchWallet = require('minimal-slp-wallet')

// Local libraries
const { SlpMutableData } = require('../index')

async function uploadData () {
  try {
    // Instantiate the BCH wallet using the private key above.
    const wallet = new BchWallet(walletWif, { interface: 'consumer-api' })
    await wallet.walletInfoPromise
    await wallet.initialize()

    // Instantiate the mutable data library
    const slpMutableData = new SlpMutableData({ wallet })

    const mutableCid = await slpMutableData.data.createTokenData(mutableData)

    console.log(' ')
    console.log(`Mutable Data CID: ${mutableCid}`)
  } catch (err) {
    console.error('Error in 02-create-mutable-data.js: ', err)
  }
}
uploadData()
