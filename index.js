/*
  An npm JavaScript library for integrating mutable data with SLP tokens.
*/

/* eslint-disable no-async-promise-executor */

// Public npm libraries

// Local libraries
const Create = require('./lib/create')
const Get = require('./lib/get')
const FilecoinData = require('./lib/filecoin-data')
const Data = require('./lib/data')

class SlpMutableData {
  constructor (localConfig = {}) {
    // Dependency injection
    this.wallet = localConfig.wallet
    if (!this.wallet) {
      throw new Error(
        'Instance of minimal-slp-wallet must be passed as wallet when instantiating this library.'
      )
    }

    // Instantiate the support libraries.
    this.create = new Create(localConfig)
    this.get = new Get(localConfig)
    this.data = new Data(localConfig)
  }
}

module.exports = { SlpMutableData, FilecoinData }
