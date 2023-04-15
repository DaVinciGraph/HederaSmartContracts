const { Client, PrivateKey,TokenId,ContractExecuteTransaction, ContractFunctionParameters, Hbar, AccountId } = require("@hashgraph/sdk");
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
// You should associate the token with the contract so that it can receive the tokens    
//===============================================================
 //Create the transaction to update the contract message
 const setContract = await new ContractExecuteTransaction()
 //Set the ID of the contract
 .setContractId(process.env.CONTRACT_ID)
 //Set the gas for the contract call
 .setGas(1_000_000)
 //Set the contract function to call
 .setFunction("associateToken",
 new ContractFunctionParameters()
 .addAddress(TokenId.fromString(process.env.TOKEN_ID).toSolidityAddress())
)
const tokenAssociateTx = await setContract.execute(client);
const tokenAssociateRx = await tokenAssociateTx.getReceipt(client);
const tokenAssociateStatus = tokenAssociateRx.status;
console.log("transaction status: " + tokenAssociateStatus.toString());
//===============================================================

}
main();