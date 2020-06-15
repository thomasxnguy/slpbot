/*
  Get the token information based on the id.
*/
// Set NETWORK to either testnet or mainnet
const NETWORK = 'testnet'

// REST API servers.
const MAINNET_API = 'https://api.fullstack.cash/v3/'
const TESTNET_API = 'http://tapi.fullstack.cash/v3/'

// bch-js-examples require code from the main bch-js repo
const BCHJS = require('@chris.troutner/bch-js')

// Instantiate bch-js based on the network.
let bchjs
if (NETWORK === 'mainnet') bchjs = new BCHJS({ restURL: MAINNET_API })
else bchjs = new BCHJS({ restURL: TESTNET_API })

module.exports = async function lookupToken (tokenId) {
  try {
    const properties = await bchjs.SLP.Utils.list(tokenId)
    return properties
  } catch (err) {
    console.error('Error in getTokenInfo: ', err)
    throw err
  }
}

