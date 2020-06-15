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

module.exports = async function GetBalance (mnemonic) {
  try {
    // root seed buffer
    const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic)

    // master HDNode
    let masterHDNode
    if (NETWORK === 'mainnet') masterHDNode = bchjs.HDNode.fromSeed(rootSeed)
    else masterHDNode = bchjs.HDNode.fromSeed(rootSeed, 'testnet') // Testnet

    // HDNode of BIP44 account
    const account = bchjs.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    const change = bchjs.HDNode.derivePath(account, '0/0')

    // get the cash address
    const cashAddress = bchjs.HDNode.toCashAddress(change)
    const slpAddress = bchjs.SLP.Address.toSLPAddress(cashAddress)

    // first get BCH balance
    const balance = await bchjs.Blockbook.balance(cashAddress)

    console.log(`BCH Balance information for ${slpAddress}:`)
    console.log(balance)
    console.log('SLP Token information:')

    // get token balances
    try {
      const tokens = await bchjs.SLP.Utils.balancesForAddress(slpAddress)

      return JSON.stringify(tokens, null, 2)
    } catch (error) {
      if (error.message === 'Address not found') return 'No tokens found.';
        return 'Error: '.concat(error.toString())
    }
  } catch (err) {
    console.error('Error in getBalance: ', err)
    console.log(`Error message: ${err.message}`)
    throw err
  }
}
