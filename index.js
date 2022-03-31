/*
  An npm JavaScript library for integrating mutable data with SLP tokens.
*/

/* eslint-disable no-async-promise-executor */

'use strict'

// Public npm libraries
const BCHJS = require('@psf/bch-js')

// Local libraries
const Create = require('./lib/create')
const Get = require('./lib/get')
const FilecoinData = require('./lib/data')

class SlpMutableData {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.bchjs = new BCHJS(localConfig)
    localConfig.bchjs = this.bchjs

    // Instantiate the support libraries.
    this.create = new Create(localConfig)
    this.get = new Get(localConfig)
    this.data = new FilecoinData()
  }
}

module.exports = { SlpMutableData, FilecoinData }
