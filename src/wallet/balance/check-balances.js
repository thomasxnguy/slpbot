const NETWORK = `mainnet`

const SLPSDK = require("../lib/SLP")

// Instantiate SLP based on the network.
let SLP
if (NETWORK === `mainnet`)
  SLP = new SLPSDK({ restURL: `https://rest.bitcoin.com/v2/` })
else SLP = new SLPSDK({ restURL: `https://trest.bitcoin.com/v2/` })

let SLP_FS
if (NETWORK === `mainnet`)
  SLP_FS = new SLPSDK({ restURL: `https://api.fullstack.cash/v3/` })
else SLP_FS = new SLPSDK({ restURL: `https://tapi.fullstack.cash/v3/` })

module.exports = async function GetBalance (mnemonic) {
  try {

    // root seed buffer
    const rootSeed = SLP.Mnemonic.toSeed(mnemonic)
    // master HDNode
    let masterHDNode
    if (NETWORK === `mainnet`) masterHDNode = SLP.HDNode.fromSeed(rootSeed)
    else masterHDNode = SLP.HDNode.fromSeed(rootSeed, "testnet") // Testnet

    // HDNode of BIP44 account
    const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    const change = SLP.HDNode.derivePath(account, "0/0")

    // get the cash address
    const cashAddress = SLP.HDNode.toCashAddress(change)
    const slpAddress = SLP.Address.toSLPAddress(cashAddress)

    // first get BCH balance
    const balance = await SLP.Address.details(cashAddress)

    console.log(`BCH Balance information for ${slpAddress}:`)
    console.log(balance)
    console.log(`SLP Token information:`)

    // get token balances
    try {
      const tokens = await SLP_FS.Utils.balancesForAddress(slpAddress)

      console.log(JSON.stringify(tokens, null, 2))
    } catch (error) {
      if (error.message === "Address not found") console.log(`No tokens found.`)
      else console.log(`Error: `, error)
    }
  } catch (err) {
    console.error(`Error in getBalance: `, err)
    console.log(`Error message: ${err.message}`)
    throw err
  }
}