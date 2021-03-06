/*
  Create a new SLP token with mutable data controlled by a second address.

  This example requires two WIF private keys. One for creating the token and
  controlling the minting baton. The other is used exclusively for controlling
  the mutable data for that token.

  You can generate private keys at wallet.fullstack.cash, and use that same
  app for interacting with the newly created token.
*/

// 1) Key pair for creating and holding the token.
const walletWif = 'L13SHXh4yCheSV9ZaF9MQq6SPM7ZWCP5WhoxjG3YokyEP6poPUs1'
// const walletAddr = 'bitcoincash:qqc3pqztxxcq7hr5g7f5us477rhxl96m65lp7cszfl'
// mnemonic: sound cliff hand peace submit author weekend subject ugly spawn earn insect

// 2) Key pair for controlling the mutable data.
// const mdaWif = 'L1uQVoF9PQ42SiPUp4oYcg887CEKZG1VaShc73sEtkLwZycwmefB'
const mda = 'bitcoincash:qpegq32ddlaj09grkkq7xsfyc5j8kfl3ygpj2zqmsv'
// mnemonic: kit educate flight trim toilet uphold diamond six angle electric share elbow

const { SlpMutableData } = require('../index')
// const SlpMutableData = require('slp-mutable-data')

async function createToken () {
  const slpMutableData = new SlpMutableData()

  try {
    // Create a 'simple' NFT with a single, undivisiable token and no minting baton.
    const tokenData = {
      name: 'Mutable Test 01',
      ticker: 'MT01',
      documentUrl: 'ipfs://bafybeidzfi3sictag4noy746gniyiwwcgio565xuzelmjfwxnga6qyiyai',
      decimals: 0,
      initialQty: 1,
      mintBatonVout: null
    }

    const txid = await slpMutableData.create.createToken(
      walletWif,
      tokenData,
      mda
    )

    console.log(`New token created with token ID: ${txid}`)
    console.log(`https://token.fullstack.cash/?tokenid=${txid}`)
  } catch (err) {
    console.error(err)
  }
}
createToken()
