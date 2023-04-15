const { Client, PrivateKey,TokenId,ContractExecuteTransaction, ContractFunctionParameters, Hbar, AccountId } = require("@hashgraph/sdk");
const { log } = require("console");
const fs = require('fs');
require('dotenv').config();

async function main() {
    //Grab your Hedera testnet account ID and private key from your .env file
    const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    // If we weren't able to grab it, we should throw a new error
    if (!myAccountId || !myPrivateKey) {
        throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present");
    }
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
    client.setDefaultMaxTransactionFee(new Hbar(50));
//===============================================================
const setContract = await new ContractExecuteTransaction()
.setContractId(process.env.CONTRACT_ID)
.setGas(100_000_00)
.setFunction(
    "withdrawToken",
    new ContractFunctionParameters()
       .addAddress(TokenId.fromString(process.env.TOKEN_ID).toSolidityAddress())
       .addInt64(10)
)
const tokenTransferTx = await setContract.execute(client);
const tokenTransferRx = await tokenTransferTx.getReceipt(client);
const tokenTransferStatus = tokenTransferRx.status;
console.log("Transaction status: " + tokenTransferStatus.toString());
//===============================================================

}
main();