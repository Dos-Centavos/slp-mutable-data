/*
  This library is used to update the mutable data associated with a token,
  using Filecoin blockchain via the https://web3.storage.
*/

// const { Web3Storage, File } = require('web3.storage')

class FilecoinData {
  constructor (localConfig = {}) {
    // Dependency injection
    this.web3Storage = localConfig.web3Storage
    if (!this.web3Storage) {
      throw new Error(
        'Must pass instance of web3.storage library when instantiating this library.'
      )
    }

    // Encapsulate dependencies
    this.Web3Storage = this.web3Storage.Web3Storage
    this.File = this.web3Storage.File
  }

  // Upload data to Filecoin.
  async uploadToFilecoin (data, apiKey) {
    try {
      if (!apiKey) {
        throw new Error(
          'apiKey needs to contain the API key from web3.storage.'
        )
      }

      const files = this.makeFileObjects(data)

      const storage = new this.Web3Storage({ token: apiKey })

      const cid = await storage.put(files)

      return cid
    } catch (err) {
      console.log('Error in uploadToFilecoin()')
      throw err
    }
  }

  // Converts an object to a File, which can then be uploaded to Filecoin.
  makeFileObjects (obj) {
    try {
      const buffer = Buffer.from(JSON.stringify(obj))

      const files = [new this.File([buffer], 'data.json')]
      return files
    } catch (err) {
      console.log('Error in makeFileObjects()')
      throw err
    }
  }
}

module.exports = FilecoinData
