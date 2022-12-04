/*
  An example for retrieving the mutable data associated with a token.
*/

// Global npm libraries
const BchWallet = require('minimal-ecash-wallet')

// Local libraries
const { SlpMutableData } = require('../index')

const tokenId =
'f3584d8882c46e42dfb0d5d132df18939ed8a04140b0bc4985c82aab9188af13'

async function getMutableData () {
  try {
    const wallet = new BchWallet(undefined, {
      interface: 'consumer-api',
      restURL: 'https://xec-consumer-or1-usa.fullstackcash.nl'
    })
    await wallet.walletInfoPromise

    const slpMutableData = new SlpMutableData({
      wallet,
      ipfsGatewayUrl: 'xec-p2wdb-gateway.fullstack.cash'
    })

    const data = await slpMutableData.get.data(tokenId)

    console.log(`data: ${JSON.stringify(data, null, 2)}`)
  } catch (err) {
    console.error(err)
  }
}
getMutableData()
