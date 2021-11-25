/*
  An example for retrieving the mutable data associated with a token.
*/

const SlpMutableData = require('../index')
const web3Storage = require('web3.storage')

const tokenId =
  'db4fcd1937edb37e035c936a22ebe0fb6f879c1d89c21dd73326581b3af61826'

async function getMutableData () {
  try {
    const slpMutableData = new SlpMutableData({ web3Storage })

    const data = await slpMutableData.get.mutableData(tokenId)

    console.log('data: ', data)
    console.log(`data: ${JSON.stringify(data, null, 2)}`)
  } catch (err) {
    console.error(err)
  }
}
getMutableData()
