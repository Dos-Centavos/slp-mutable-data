/*
  An example for retrieving the mutable data associated with a token.
*/

const { SlpMutableData } = require('../index')

// const tokenId =
// '80f1f5de765dc1a773c9e24167e3fe2599aec1bcbeb2c061eaafc63959690adc'
const tokenId =
'c4d646177932cccb34f876b05256ad47e943523150dd25ff8ace17a660e8376c'

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
