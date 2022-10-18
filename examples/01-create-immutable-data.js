/*
  Run this script first to upload the immutable data for your new
  token to IPFS.

  This example script shows how to create immutable data for a
  new token. This data is stored in JSON and uploaded to IPFS. The content
  ID (CID) is returned and can be used when creating the token.

  Token data should comply with the PS007 specification for token data:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps007-token-data-schema.md
*/

const now = new Date()

// Customize these objects for your own token. These objects will be converted
// to JSON and uploaded to IPFS.
const immutableData = {
  schema: 'ps007-v1.0.1',
  dateCreated: now.toISOString(),
  userData: 'Your custom data can go here.',
  jsonLd: {},
  issuer: 'NFT Creator by the FullStack.cash',
  issuerUrl: 'https://nft-creator.fullstack.cash/',
  license: ''
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

    const immutableCid = await slpMutableData.data.createTokenData(immutableData)
    // console.log(`immutable data CID: ${immutableCid}`)

    console.log(' ')
    console.log(`Immutable Data CID: ${immutableCid}`)
  } catch (err) {
    console.error('Error in 01-create-immutable-data.js: ', err)
  }
}
uploadData()
