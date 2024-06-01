import { ethers, Transaction } from "ethers";
import { Squid } from "@0xsquid/sdk";

export interface Main {
  route: MainRoute;
}

export interface MainRoute {
  estimate: Estimate;
  params: Params;
  transactionRequest: TransactionRequest;
}

export interface Estimate {
  fromAmount: string;
  sendAmount: string;
  toAmount: string;
  toAmountMin: string;
  fromAmountUSD: string;
  route: EstimateRoute;
  feeCosts: FeeCost[];
  gasCosts: GasCost[];
  estimatedRouteDuration: number;
  isExpressSupported: boolean;
  exchangeRate: string;
  aggregatePriceImpact: string;
  toAmountUSD: string;
  toAmountMinUSD: string;
}

export interface FeeCost {
  name: string;
  description: string;
  percentage: string;
  token: Token;
  amount: string;
  amountUSD: string;
}

export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  coingeckoId: string;
  bridgeOnly?: boolean;
  commonKey?: string;
}

export interface GasCost {
  type: string;
  token: Token;
  amount: string;
  amountUSD: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  estimate: string;
  limit: string;
}

export interface EstimateRoute {
  fromChain: Chain[];
  toChain: Chain[];
}

export interface Chain {
  type: string;
  dex: Dex;
  target: string;
  path: string[];
  poolFees: number[];
  swapType: string;
  squidCallType: number;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  toAmountMin: string;
  exchangeRate: string;
  priceImpact: string;
  isFrom: boolean;
  dynamicSlippage: number;
}

export interface Dex {
  chainName: string;
  dexName: string;
  swapRouter: string;
  quoter: string;
  isCrypto: boolean;
  isStable?: boolean;
}

export interface Params {
  integratorId: string;
  collectFees: CollectFees;
  enableExpress: boolean;
  slippage: number;
  quoteOnly: boolean;
  toAddress: string;
  fromAddress: string;
  fromAmount: string;
  toToken: Token;
  fromToken: Token;
  toChain: string;
  fromChain: string;
}

export interface CollectFees {
  feeLocation: string;
}

export interface TransactionRequest {
  routeType: string;
  targetAddress: string;
  data: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

const userAddress = "0xC03e0986879738BF7688b7Dc42C679BB498a530f";
const privateKey = "YOUR_PRIVATE_KEY";
const rpcUrl = "https://rpc.ankr.com/base"; // fromChain RPC URL

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);

console.log(signer.address);

const integratorId = "squidframe-34ce7c50-ed06-4ac3-bc60-589277b02b76";

let headersList = {
  Accept: "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  "x-integrator-id": "squidframe-34ce7c50-ed06-4ac3-bc60-589277b02b76",
};

const sendingAmount = ethers.parseEther("0.0001").toString();
const fromToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const toToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
const fromChain = "8453"; // Base
const toChain = "314"; // Filecoin Mainnet

let response = await fetch(
  `https://api.squidrouter.com/v1/route?fromChain=${fromChain}&fromToken=${fromToken}&fromAddress=${userAddress}&fromAmount=${sendingAmount}&toChain=${toChain}&toToken=${toToken}&toAddress=${userAddress}&quoteOnly=false&slippage=1.5&enableExpress=true`,
  {
    method: "GET",
    headers: headersList,
  }
);

const data = (await response.json()) as unknown as Main;

const targetAddress = data.route.transactionRequest.targetAddress;
const callData = data.route.transactionRequest.data;
const value = data.route.transactionRequest.value;
const gasLimit = data.route.transactionRequest.gasLimit;
const gasPrice = data.route.transactionRequest.gasPrice;

const tx = {
  from: userAddress,
  to: targetAddress,
  data: callData,
  value: value,
  gasLimit: gasLimit,
  gasPrice: gasPrice,
};

const txResponse = await signer.sendTransaction(tx);
console.log(txResponse);
