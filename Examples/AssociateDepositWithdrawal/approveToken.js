const { Client, PrivateKey,AccountAllowanceApproveTransaction,TokenId, Hbar, AccountId, } = require("@hashgraph/sdk");
require('dotenv').config();

async function main() {
    const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    if (!myAccountId || !myPrivateKey) {throw new Error("Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present")}
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
    client.setDefaultMaxTransactionFee(new Hbar(50));
//You Should give the contract approveTokenAllowance so that it can transfer tokens on your behalf
//===========================================
// Create the transaction
const transaction = new AccountAllowanceApproveTransaction()
    .approveTokenAllowance(TokenId.fromString(process.env.TOKEN_ID)
    ,myAccountId
    ,AccountId.fromString(process.env.CONTRACT_ID)
    , 1000)
    .freezeWith(client)
//Sign the transaction with the owner account key
const signTx = await transaction.sign(myPrivateKey);

//Sign the transaction with the client operator private key and submit to a Hedera network
const txResponse = await signTx.execute(client);

//Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);

//Get the transaction consensus status
const transactionStatus = receipt.status;

console.log("status: " +transactionStatus.toString());
//===============================================================

}

main()