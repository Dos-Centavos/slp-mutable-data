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
const FilecoinData = require('./lib/data')

class SlpMutableData {
  constructor (localConfig = {}) {
    // Encapsulate dependencies
    this.bchjs = new BCHJS()
    localConfig.bchjs = this.bchjs

    // Instantiate the support libraries.
    this.create = new Create(localConfig)
    this.get = new Get(localConfig)
  }
}

module.exports = { SlpMutableData, FilecoinData }
