/*
  An example for retrieving the mutable data associated with a token.
*/

// Global npm libraries
const BchWallet = require('minimal-slp-wallet')

// Local libraries
const { SlpMutableData } = require('../index')

const tokenId =
'4d9e114ad9d5e1df8fd3cf850c28e968a41bd31b639f807041596e882d6fa148'

async function getMutableData () {
  try {
    const wallet = new BchWallet(undefined, { interface: 'consumer-api' })
    await wallet.walletInfoPromise

    const slpMutableData = new SlpMutableData({ wallet })

    const data = await slpMutableData.get.data(tokenId)

    console.log(`data: ${JSON.stringify(data, null, 2)}`)
  } catch (err) {
    console.error(err)
  }
}
getMutableData()
