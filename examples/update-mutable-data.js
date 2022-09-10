/*
  9/10/22 CT: This example is no longer valid. It needs to be refactored to
  reflect that the original filecoin-data.js lib was broken up into two
  libraries (filecoin-data.js and data.js).

  An example for updating the mutable data associated with a token.

  This follows section 6 of PS002 specification:
  https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps002-slp-mutable-data.md#6-update-mutable-data

  This example assumes you have an API key from web3.storage, which is accessed
  through the FILECOIN_TOKEN environment variable.
*/

const apiToken = process.env.FILECOIN_TOKEN
if (!apiToken) {
  throw new Error(
    'Get API token from https://web3.storage and pass it as the FILECOIN_TOKEN environment variable before running this example.'
  )
}

// Replace this with your own WIF private key.
const mdaWif = 'L1uQVoF9PQ42SiPUp4oYcg887CEKZG1VaShc73sEtkLwZycwmefB'
// const mda = 'bitcoincash:qpegq32ddlaj09grkkq7xsfyc5j8kfl3ygpj2zqmsv'
// mnemonic: kit educate flight trim toilet uphold diamond six angle electric share elbow

const web3Storage = require('web3.storage')

const { SlpMutableData, FilecoinData } = require('../index')
// const SlpMutableData = require('slp-mutable-data')

async function updateMutableData () {
  try {
    const slpMutableData = new SlpMutableData()
    const filecoinData = new FilecoinData({
      web3Storage,
      bchjs: slpMutableData.bchjs
    })

    // Edit this to reflect the mutable data for your token.
    const mutableData = {
      tokenIcon:
        'https://gateway.ipfs.io/ipfs/bafybeiehitanirn5gmhqjg44xrmdtomn4n5lu5yjoepsvgpswk5mggaw6i/LP_logo-1.png',
      about:
        'Mutable data managed with npm package: https://www.npmjs.com/package/slp-mutable-data'
    }

    // Upload the object above to Filecoin.
    const cid = await filecoinData.uploadToFilecoin(mutableData, apiToken)
    console.log(`Filecoin & IPFS CID: ${cid}`)
    console.log(`https://${cid}.ipfs.dweb.link/data.json`)

    const cidStr = `ipfs://${cid}`

    const hex = await filecoinData.writeCIDToOpReturn(cidStr, mdaWif)

    // Broadcast transaction to the network
    const txid = await slpMutableData.bchjs.RawTransactions.sendRawTransaction(
      hex
    )

    console.log(`TXID for updated CID: ${txid}`)
    console.log(`https://blockchair.com/bitcoin-cash/transaction/${txid}`)
  } catch (err) {
    console.error(err)
  }
}
updateMutableData()
