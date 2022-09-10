/*
  An example for retrieving the mutable data associated with a token.
*/

const BchWallet = require('minimal-slp-wallet/index')

const { SlpMutableData } = require('../index')

const tokenId =
'c85042ab08a2099f27de880a30f9a42874202751d834c42717a20801a00aab0d'

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
