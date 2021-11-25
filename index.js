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

class SlpMutableData {
  constructor () {
    // Encapsulate dependencies
    this.bchjs = new BCHJS()
    this.create = new Create({ bchjs: this.bchjs })
    this.get = new Get({ bchjs: this.bchjs })
  }
}

module.exports = SlpMutableData
