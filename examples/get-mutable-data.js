/*
  An example for retrieving the mutable data associated with a token.
*/

const { SlpMutableData } = require('../index')

const tokenId =
  '9a8101fac6db3c763060d26888299334aee3fc36559ebdeafb8dd034a7951502'

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
