# slp-mutable-data

This is a JavaScript library that is packaged with [Browserify](https://browserify.org/), to make it accessible to both browser-based and node.js-based JavaScript apps. It allows Bitcoin Cash (BCH) wallets to create, read, and update tokens that have both mutable (changeable) and immutable (unchangeable) data. Data is stored off-chain, and available via [IPFS](https://ipfs.io).

This library implements this [PS002 specification for token mutable data](https://github.com/Permissionless-Software-Foundation/specifications/blob/master/ps002-slp-mutable-data.md). It follows a series of pointers on the Bitcoin Cash blockchain to retrieve a JSON file from the IPFS network. This is a way to track changing data associated with a token. It's a way for video game characters, supply chain items, and other unique changing assets to be represented by a token. This library is an extension of the [Cash Stack](https://cashstack.info).

## Installation
Here are different ways to consume this library in your app, depending on the environment you are using.

### Browser
`<script src="https://unpkg.com/slp-mutable-data"></script>`

### Node.js
`npm install --save slp-mutable-data`

```javascript
// ESM import
import { SlpMutableData } from 'slp-mutable-data'

// CommonJS require
const { SlpMutableData } = require('slp-mutable-data')
```

### Examples
Examples are provided in the [examples directory](https://github.com/Dos-Centavos/slp-mutable-data/tree/master/examples):

1. [Create Immutable Data](https://github.com/Dos-Centavos/slp-mutable-data/blob/master/examples/01-create-immutable-data.js)
2. [Create Mutable Data](https://github.com/Dos-Centavos/slp-mutable-data/blob/master/examples/02-create-mutable-data.js)
3. [Create a Token](https://github.com/Dos-Centavos/slp-mutable-data/blob/master/examples/03-create-token.js) with both mutable and immutable data.
4. [Update Mutable Data](https://github.com/Dos-Centavos/slp-mutable-data/blob/master/examples/04-update-mutable-data.js).
5. [Get Token Data](https://github.com/Dos-Centavos/slp-mutable-data/blob/master/examples/05-get-mutable-data.js).

## Sponsor

Development and maintenance of this library is sponsored by [Launchpad IP](https://launchpadip.com). If you need protection for your intellectual property, contact Launchpad.

Maintenance and development is managed by the [Permissionless Software Foundation](https://psfoundation.cash). If this library provides value to you, please consider making a donation to support the PSF developers:

<div align="center">
<img src="./psf-burn-qr.png" />
<p>bitcoincash:qqsrke9lh257tqen99dkyy2emh4uty0vky9y0z0lsr</p>
</div>

# Licence

[GPL v2](LICENSE.md)
