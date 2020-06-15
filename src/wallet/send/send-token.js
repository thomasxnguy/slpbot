// Set NETWORK to either testnet or mainnet
const NETWORK = "testnet";

// REST API servers.
const MAINNET_API = "https://api.fullstack.cash/v3/";
const TESTNET_API = "http://tapi.fullstack.cash/v3/";

// bch-js-examples require code from the main bch-js repo
const BCHJS = require("@chris.troutner/bch-js");

// Instantiate bch-js based on the network.
let bchjs;
if (NETWORK === "mainnet") bchjs = new BCHJS({ restURL: MAINNET_API });
else bchjs = new BCHJS({ restURL: TESTNET_API , apiToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZTVmMjQwZjZkMmNkMDAxMjZiNzUxYiIsImVtYWlsIjoidGhvbWFzeG5ndXlAZ21haWwuY29tIiwiYXBpTGV2ZWwiOjAsInJhdGVMaW1pdCI6MywiaWF0IjoxNTkyMTI4MTAxLCJleHAiOjE1OTQ3MjAxMDF9.n2Rd11_HQn99L7jQiRgg2G8ytBi1-xnTsnPkBXXSi5Y'});

// Returns the utxo with the biggest balance from an array of utxos.
function findBiggestUtxo(utxos) {
  let largestAmount = 0;
  let largestIndex = 0;

  for (let i = 0; i < utxos.length; i+=1) {
    const thisUtxo = utxos[i];

    if (thisUtxo.satoshis > largestAmount) {
      largestAmount = thisUtxo.satoshis;
      largestIndex = i;
    }
  }

  return utxos[largestIndex];
}

module.exports = async function SendToken(mnemonic, tokenId, amount, toAddress) {
  try {

    // Address check
    if (toAddress === "")  {
      return "invalid address"
    }

    try {
      bchjs.SLP.Address.toLegacyAddress(toAddress)
    } catch (e) {
      return "invalid address"
    }

    // root seed buffer
    const rootSeed = await bchjs.Mnemonic.toSeed(mnemonic);
    // master HDNode
    let masterHDNode;
    if (NETWORK === "mainnet") masterHDNode = bchjs.HDNode.fromSeed(rootSeed);
    else masterHDNode = bchjs.HDNode.fromSeed(rootSeed, "testnet"); // Testnet

    // HDNode of BIP44 account
    const account = bchjs.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");
    const change = bchjs.HDNode.derivePath(account, "0/0");

    // Generate an EC key pair for signing the transaction.
    const keyPair = bchjs.HDNode.toKeyPair(change);

    // get the cash address
    const cashAddress = bchjs.HDNode.toCashAddress(change);
    const slpAddress = bchjs.HDNode.toSLPAddress(change);

    // Get UTXOs held by this address.
    const utxos = await bchjs.Blockbook.utxo(cashAddress);
    // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`);

    if (utxos.length === 0) throw new Error("No UTXOs to spend! Exiting.");

    // Identify the SLP token UTXOs.
    let tokenUtxos = await bchjs.SLP.Utils.tokenUtxoDetails(utxos);
    // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`);

    // Filter out the non-SLP token UTXOs.
    const bchUtxos = utxos.filter((utxo, index) => {
      const tokenUtxo = tokenUtxos[index];
      if (!tokenUtxo) return true;
    });
    // console.log(`bchUTXOs: ${JSON.stringify(bchUtxos, null, 2)}`);

    if (bchUtxos.length === 0) {
      throw new Error("Wallet does not have a BCH UTXO to pay miner fees.");
    }

    // Filter out the token UTXOs that match the user-provided token ID.
    tokenUtxos = tokenUtxos.filter((utxo, index) => {
      if (
        utxo && // UTXO is associated with a token.
        utxo.tokenId === tokenId && // UTXO matches the token ID.
        utxo.utxoType === "token" // UTXO is not a minting baton.
      )
      {
        return true;
      }
      return false;
    });
    // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`);

    if (tokenUtxos.length === 0) {
      throw new Error("No token UTXOs for the specified token could be found.");
    }

    // Choose a UTXO to pay for the transaction.
    const bchUtxo = findBiggestUtxo(bchUtxos);
    // console.log(`bchUtxo: ${JSON.stringify(bchUtxo, null, 2)}`);

    // Generate the OP_RETURN code.
    // const slpSendObj = bchjs.SLP.TokenType1.generateSendOpReturn(
    //   tokenUtxos,
    //   TOKENQTY
    // )
    // const slpData = bchjs.Script.encode(slpSendObj.script)

    const slpSendObj = bchjs.SLP.TokenType1.generateSendOpReturn(
      tokenUtxos,
      amount
    );
    const slpData = slpSendObj.script;
    // console.log(`slpOutputs: ${slpSendObj.outputs}`);

    // BEGIN transaction construction.

    // instance of transaction builder
    let transactionBuilder;
    if (NETWORK === "mainnet") {
      transactionBuilder = new bchjs.TransactionBuilder();
    } else transactionBuilder = new bchjs.TransactionBuilder("testnet");

    // Add the BCH UTXO as input to pay for the transaction.
    const originalAmount = bchUtxo.satoshis;
    transactionBuilder.addInput(bchUtxo.txid, bchUtxo.vout);

    // add each token UTXO as an input.
    for (let i = 0; i < tokenUtxos.length; i+=1) {
      transactionBuilder.addInput(tokenUtxos[i].txid, tokenUtxos[i].vout);
    }

    // get byte count to calculate fee. paying 1 sat
    // Note: This may not be totally accurate. Just guessing on the byteCount size.
    // const byteCount = this.BITBOX.BitcoinCash.getByteCount(
    //   { P2PKH: 3 },
    //   { P2PKH: 5 }
    // )
    // //console.log(`byteCount: ${byteCount}`)
    // const satoshisPerByte = 1.1
    // const txFee = Math.floor(satoshisPerByte * byteCount)
    // console.log(`txFee: ${txFee} satoshis\n`)
    const txFee = 250;

    // amount to send back to the sending address. It's the original amount - 1 sat/byte for tx size
    const remainder = originalAmount - txFee - 546 * 2;
    if (remainder < 1) {
      throw new Error("Selected UTXO does not have enough satoshis");
    }
    // console.log(`remainder: ${remainder}`)

    // Add OP_RETURN as first output.
    transactionBuilder.addOutput(slpData, 0);

    // Send dust transaction representing tokens being sent.
    transactionBuilder.addOutput(
      bchjs.SLP.Address.toLegacyAddress(toAddress),
      546
    );

    // Return any token change back to the sender.
    if (slpSendObj.outputs > 1) {
      transactionBuilder.addOutput(
        bchjs.SLP.Address.toLegacyAddress(slpAddress),
        546
      );
    }

    // Last output: send the BCH change back to the wallet.
    transactionBuilder.addOutput(
      bchjs.Address.toLegacyAddress(cashAddress),
      remainder
    );

    // Sign the transaction with the private key for the BCH UTXO paying the fees.
    let redeemScript;
    transactionBuilder.sign(
      0,
      keyPair,
      redeemScript,
      transactionBuilder.hashTypes.SIGHASH_ALL,
      originalAmount
    );

    // Sign each token UTXO being consumed.
    for (let i = 0; i < tokenUtxos.length; i+=1) {
      const thisUtxo = tokenUtxos[i];

      transactionBuilder.sign(
        1 + i,
        keyPair,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        thisUtxo.satoshis
      );
    }

    // build tx
    const tx = transactionBuilder.build();

    // output rawhex
    const hex = tx.toHex();
    // console.log(`Transaction raw hex: `, hex)

    // END transaction construction.

    // Broadcast transation to the network
    const txidStr = await bchjs.RawTransactions.sendRawTransaction([hex]);

    return txidStr;
  } catch (err) {
    console.log(`Error message: ${err.message}`);
    throw err
  }
}


