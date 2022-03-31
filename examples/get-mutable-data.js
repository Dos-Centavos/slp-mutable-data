/*
  An example for retrieving the mutable data associated with a token.
*/

const { SlpMutableData } = require('../index')

const tokenId =
'80f1f5de765dc1a773c9e24167e3fe2599aec1bcbeb2c061eaafc63959690adc'
// const tokenId =
// '339938e6ccdb062dfd4242985fd7a4522e06f6cb90aaa6867b482bfcdf9a19ad'

async function getMutableData () {
  try {
    const slpMutableData = new SlpMutableData()

    const data = await slpMutableData.get.mutableData(tokenId)

    console.log('data: ', data)
    console.log(`data: ${JSON.stringify(data, null, 2)}`)
  } catch (err) {
    console.error(err)
  }
}
getMutableData()
