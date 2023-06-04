/*
  An example for retrieving the mutable data associated with a token.
*/

// Global npm libraries
const BchWallet = require('minimal-slp-wallet')

// Local libraries
const { SlpMutableData } = require('../index')

// const tokenId = '0de866f9fda1e667f20540a6c660a86b71cc57982b5be232459c44899c437ffc'
const tokenId = '250025cf796c371aa4f7e841cc5b67312d48ce1a33a0a504fbb6c678aa8a376e'

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
