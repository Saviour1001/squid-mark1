import { BigNumberish, ethers } from "ethers";
import { Squid } from "@0xsquid/sdk";

const userAddress = "0xC03e0986879738BF7688b7Dc42C679BB498a530f";
const integratorId = "squidframe-34ce7c50-ed06-4ac3-bc60-589277b02b76";

const squid = new Squid({
  baseUrl: "https://api.squidrouter.com/",
  integratorId: integratorId,
});

// initialize the Squid client
await squid.init();

const sendingAmount = ethers.parseEther("0.0001").toString();

console.log(sendingAmount.toString());

const { route } = await squid.getRoute({
  fromChain: "8453", // Base
  fromAmount: sendingAmount,
  fromToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  toChain: "10", // Filecoin
  toToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  fromAddress: userAddress,
  toAddress: userAddress,
  slippage: 1.5,
});

const privateKey =
  "0x49be30f7c8578835774320afb5fcdef6c94cceb9d154f326b363e2983ec0723c";
const rpcUrl = "https://rpc.ankr.com/base"; // fromChain RPC URL

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);

// Convert gasLimit to a string
if (route && route.transactionRequest?.gasLimit) {
  console.log(route.transactionRequest.gasLimit);
  route.transactionRequest.gasLimit =
    route.transactionRequest.gasLimit.toString();
}

// Execute the swap transaction
// const tx = (await squid.executeRoute({
//   signer,
//   route,
// })) as unknown as ethers.TransactionResponse;
// const txReceipt = await tx.wait();

// Show the transaction receipt with Axelarscan link
// const axelarScanLink = "https://axelarscan.io/gmp/" + txReceipt?.hash;
// console.log(`Finished! Check Axelarscan for details: ${axelarScanLink}`);
