import { ethers } from "ethers";
import { Squid } from "@0xsquid/sdk";

const userAddress = "0xC03e0986879738BF7688b7Dc42C679BB498a530f";
const integratorId = "squidframe-34ce7c50-ed06-4ac3-bc60-589277b02b76";

const squid = new Squid({
  baseUrl: "https://v2.api.squidrouter.com",
  integratorId: integratorId,
});

// initialize the Squid client
await squid.init();

const sendingAmount = ethers.parseEther("0.0001").toString();

console.log(sendingAmount.toString());

const { route } = await squid.getRoute({
  fromChain: "8453", // Base
  fromAmount: sendingAmount,
  fromToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  toChain: "10", // Optimism
  toToken: "0xEEeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  fromAddress: userAddress,
  toAddress: userAddress,
  slippageConfig: {
    autoMode: 1,
  },
});

console.log(route);

const privateKey = "YOUR_PRIVATE_KEY";
const rpcUrl = "https://rpc.ankr.com/base"; // fromChain RPC URL

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);

const result = await squid.executeRoute({
  route,
  signer,
});

console.log(result);
