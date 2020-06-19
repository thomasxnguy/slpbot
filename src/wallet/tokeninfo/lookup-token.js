const NETWORK = `mainnet`

const SLPSDK = require("../lib/SLP")

// Instantiate SLP based on the network.
let SLP
if (NETWORK === `mainnet`)
  SLP = new SLPSDK({ restURL: `https://rest.bitcoin.com/v2/` })
else SLP = new SLPSDK({ restURL: `https://trest.bitcoin.com/v2/` })


module.exports = async function lookupToken (tokenId) {
  try {
    const properties = await SLP.Utils.list(tokenId)
    return properties;
  } catch (err) {
    console.error(`Error in getTokenInfo: `, err)
    throw err
  }
}
