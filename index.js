/*
  An npm JavaScript library for front end web apps. Implements a minimal
  Bitcoin Cash wallet.
*/

/* eslint-disable no-async-promise-executor */

'use strict'

// Public npm libraries
const BCHJS = require('@psf/bch-js')

// Local libraries
const Create = require('./lib/create')
const Get = require('./lib/get')
const Data = require('./lib/data')

class SlpMutableData {
  constructor (localConfig = {}) {
    // Dependency Injection
    this.web3Storage = localConfig.web3Storage
    if (!this.web3Storage) {
      throw new Error(
        'Must pass instance of web3.storage library when instantiating slp-mutable-data library.'
      )
    }

    // Encapsulate dependencies
    this.bchjs = new BCHJS()
    localConfig.bchjs = this.bchjs

    // Instantiate the support libraries.
    this.create = new Create(localConfig)
    this.get = new Get(localConfig)
    this.data = new Data(localConfig)
  }
}

module.exports = SlpMutableData
