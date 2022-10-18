/*
  Create a new SLP token with mutable data controlled by a second address.

  This example requires two WIF private keys. One for creating the token and
  controlling the minting baton. The other is used exclusively for controlling
  the mutable data for that token.

  You can generate private keys at wallet.fullstack.cash, and use that same
  app for interacting with the newly created token.
*/

// 1) Key pair for creating and holding the token.
const walletWif = 'L1XkvKux3hB49W6ChqPuX1CPhkM9cSvAFZoGgZ7EZa4poaqPtQb9'
// 'bitcoincash:qz3fhj6yf9t4fs7fl3pgvg890teyd2ks9uhc4hu6wc'
// mnemonic: famous squeeze provide slice become august cigar symptom cream else start garage

// 2) Key pair for controlling the mutable data address (MDA).
// const mdaWif = 'KxP3S56Tcn7sEncgozp4kpGvnUK5Gy6dEtfjteAe8SiPdB7RTJoy'
const mda = 'bitcoincash:qr9czk5ullqpcq250n0x2dy73vu3wedmmyjstg4km6'
// mnemonic: husband cook purpose dream obscure legal exotic book quote bulk need cabbage

// This CID is generated from 01-create-data.js. Replace it with your own CID.
const immutableCid = 'bafybeiczbwscirag7didwheoq5ei6alxerbtbugdtafyysjqzo2z37uaw4'

const BchWallet = require('minimal-slp-wallet')
const { SlpMutableData } = require('../index')
// const SlpMutableData = require('slp-mutable-data')

async function createToken () {
  const wallet = new BchWallet(walletWif, { interface: 'consumer-api' })
  await wallet.walletInfoPromise
  await wallet.initialize()

  const slpMutableData = new SlpMutableData({ wallet })

  try {
    // Create a 'simple' NFT with a single, undivisiable token and no minting baton.
    const tokenData = {
      name: 'Mutable Test 01',
      ticker: 'MT01',
      documentUrl: `ipfs://${immutableCid}`,
      decimals: 0,
      initialQty: 1,
      mintBatonVout: null
    }

    const txid = await slpMutableData.create.createToken(
      walletWif,
      tokenData,
      mda
    )

    console.log(`\nNew token created with token ID: ${txid}`)
    console.log(`https://token.fullstack.cash/?tokenid=${txid}`)
  } catch (err) {
    console.error(err)
  }
}
createToken()
