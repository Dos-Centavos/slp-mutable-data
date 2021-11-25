/*
  This library is used to update the mutable data associated with a token.
*/

class Data {
  constructor (localConfig = {}) {
    this.bchjs = localConfig.bchjs
    if (!this.bchjs) {
      throw new Error(
        'bch-js instance required when instantiating get.js library'
      )
    }
  }
}

module.exports = Data
