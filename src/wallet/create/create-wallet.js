const NETWORK = `mainnet`
const SLPSDK = require("../lib/SLP")

// Instantiate SLP based on the network.
let SLP
if (NETWORK === `mainnet`)
  SLP = new SLPSDK({ restURL: `https://rest.bitcoin.com/v2/` })
else SLP = new SLPSDK({ restURL: `https://trest.bitcoin.com/v2/` })

const lang = "english"

module.exports = async function CreateWallet() {
  const outObj = {
    mnemonic: "",
    cashAddress: "",
    slpAddress: "",
    legacyAddress: "",
  }
  try {
// create 128 bit BIP39 mnemonic
    const mnemonic = SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()[lang])
    outObj.mnemonic = mnemonic

// root seed buffer
    const rootSeed = SLP.Mnemonic.toSeed(mnemonic)

// master HDNode
    let masterHDNode
    if (NETWORK === `mainnet`) masterHDNode = SLP.HDNode.fromSeed(rootSeed)
    else masterHDNode = SLP.HDNode.fromSeed(rootSeed, "testnet") // Testnet

// HDNode of BIP44 account
    const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    for (let i = 0; i < 10; i++) {
      const childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`)
      if (i === 0) {
        outObj.cashAddress = SLP.HDNode.toCashAddress(childNode)
        outObj.slpAddress = SLP.Address.toSLPAddress(outObj.cashAddress)
        outObj.legacyAddress = SLP.Address.toLegacyAddress(outObj.cashAddress)
      }
    }

// derive the first external change address HDNode which is going to spend utxo
    const change = SLP.HDNode.derivePath(account, "0/0")

// get the cash address
    SLP.HDNode.toCashAddress(change)

    return outObj;
  } catch (err) {
    console.error(`Error in create wallet: `, err)
    console.log(`Error message: ${err.message}`)
    throw err
  }
}