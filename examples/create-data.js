/*
  An example for generating a JSON document, which is then uploaded to
  Filecoin. This returns the CID, which makes the JSON document immutible.

  This example can be used to generate data for the token; both immutable and
  mutable data. The difference between the two is that mutable data contains a
  pointer that points to new uploads.

  This example assumes you have an API key from web3.storage, which is accessed
  through the FILECOIN_TOKEN environment variable.
*/

const apiToken = process.env.FILECOIN_TOKEN
if (!apiToken) {
  throw new Error(
    'Get API token from https://web3.storage and pass it as the FILECOIN_TOKEN environment variable before running this example.'
  )
}

const web3Storage = require('web3.storage')

const { SlpMutableData, FilecoinData } = require('../index')
// const SlpMutableData = require('slp-mutable-data')

async function createImmutableData () {
  try {
    const slpMutableData = new SlpMutableData()
    const filecoinData = new FilecoinData({
      web3Storage,
      bchjs: slpMutableData.bchjs
    })

    const immutableData = {
      issuer: 'Launchpad Intellectual Property, Inc.',
      website: 'http://launchpadip.com/',
      dateCreated: '2022-01-11'
    }

    const cid = await filecoinData.uploadToFilecoin(immutableData, apiToken)
    console.log(`Filecoin & IPFS CID: ${cid}`)
    console.log(`https://${cid}.ipfs.dweb.link/data.json`)
  } catch (err) {
    console.error(err)
  }
}
createImmutableData()
