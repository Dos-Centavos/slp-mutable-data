/*
  An example for retrieving the mutable data associated with a token.
*/

const { SlpMutableData } = require('../index')

const tokenId =
'f055256b938f1ecfa270459d6f12c7c8c82b66d3263c03d5074445a2b1a498a3'

async function getMutableData () {
  try {
    const slpMutableData = new SlpMutableData()

    const data = await slpMutableData.get.data(tokenId)

    console.log(`data: ${JSON.stringify(data, null, 2)}`)
  } catch (err) {
    console.error(err)
  }
}
getMutableData()
