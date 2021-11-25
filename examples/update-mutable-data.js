/*
  An example for updating the mutable data associated with a token.
*/

const apiToken = process.env.FILECOIN_TOKEN
if (!apiToken) {
  throw new Error(
    'Get API token from https://web3.storage and pass it as the FILECOIN_TOKEN environment variable before running this example.'
  )
}

const mspWif = 'L1uQVoF9PQ42SiPUp4oYcg887CEKZG1VaShc73sEtkLwZycwmefB'
// const mspAddr = 'bitcoincash:qpegq32ddlaj09grkkq7xsfyc5j8kfl3ygpj2zqmsv'
// mnemonic: kit educate flight trim toilet uphold diamond six angle electric share elbow

const web3Storage = require('web3.storage')

const SlpMutableData = require('../index')
// const SlpMutableData = require('slp-mutable-data')

async function updateMutableData () {
  try {
    const slpMutableData = new SlpMutableData({ web3Storage })

    const mutableData = {
      tokenIcon:
        'https://psfoundation.cash/static/psf-logo-32a2c411985bbbf299687b06c3224384.png',
      about:
        'Mutable data managed with npm package: https://www.npmjs.com/package/slp-mutable-data'
    }

    const cid = await slpMutableData.data.uploadToFilecoin(
      mutableData,
      apiToken
    )
    console.log(`Filecoin & IPFS CID: ${cid}`)

    const hex = await slpMutableData.data.writeCIDToOpReturn(cid, mspWif)

    // Broadcast transaction to the network
    const txid = await slpMutableData.bchjs.RawTransactions.sendRawTransaction(
      hex
    )

    console.log(`TXID for updated CID: ${txid}`)
  } catch (err) {
    console.error(err)
  }
}
updateMutableData()
