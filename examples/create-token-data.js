/*
  This example shows how to create JSON data and pin it across the cluster
  of P2WDB Pinning Service nodes. This example is used to create mutable and
  immutable data for use in token data.
*/

// 1) Key pair for paying the P2WDB writes. Must contain some BCH.
const walletWif = 'L13SHXh4yCheSV9ZaF9MQq6SPM7ZWCP5WhoxjG3YokyEP6poPUs1'
// const walletAddr = 'bitcoincash:qqc3pqztxxcq7hr5g7f5us477rhxl96m65lp7cszfl'
// mnemonic: sound cliff hand peace submit author weekend subject ugly spawn earn insect

// Global NPM libraries
const BchWallet = require('minimal-slp-wallet/index.js')

// Local libraries
const { SlpMutableData } = require('../index.js')
// const SlpMutableData = require('slp-mutable-data/index.js')

// Modify this object to contain the JSON data that you want to pin to IPFS.
const exampleJson = {
  issuer: 'http://psfoundation.cash',
  website: 'https://nft-creator.fullstack.cash',
  userData: 'This is some user-defined data.'
}

async function pinJsonExample () {
  try {
    // Create the BCH wallet.
    const wallet = new BchWallet(walletWif, { interface: 'consumer-api' })

    // Instantiate the mutable data library.
    const slpMutableData = new SlpMutableData({ wallet })

    // Pin the example JSON to IPFS.
    const cid = await slpMutableData.data.createTokenData(exampleJson)
    console.log('cid: ', cid)

    console.log(`JSON pinned to IPFS with this CID: ${cid}`)
    console.log('View it here:')
    console.log(`https://pearson-gateway.fullstackcash.net/ipfs/${cid}`)
  } catch (err) {
    console.error('Error in pinJsonExample: ', err)
  }
}

// Execute the example code.
pinJsonExample(exampleJson)
