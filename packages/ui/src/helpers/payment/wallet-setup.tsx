import { PaymentApi } from "@passes/api-client"
import { PublicKey, Transaction } from "@solana/web3.js"

import {
  sendAndGenerateEthereumTokenTransactionMessage,
  sendAndGenerateEthereumTransactionMessage,
  sendAndGenerateSolanaTokenTransactionMessage
} from "./transactions"

type DisplayEncoding = "utf8" | "hex"
type PhantomEvent = "disconnect" | "connect" | "accountChanged"
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage"

interface ConnectOpts {
  onlyIfTrusted: boolean
}

export interface PhantomProvider {
  publicKey: PublicKey | null
  isConnected: boolean | null
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>
  signAndSendTransaction: (transaction: Transaction) => Promise<any>
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  on: (event: PhantomEvent, handler: (args: any) => void) => void
  off: (event: PhantomEvent) => void
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>
}
interface EthereumMethod {
  method: string
  params?: any
}
export interface EthereumProvider {
  isMetaMask?: boolean
  request: (action: EthereumMethod) => Promise<any>
  on: (event: string, handler: (args: any) => void) => void
  off: (event: string) => void
  waitForTransaction: (txHash: string) => void
}

export const connectMetamask = async (
  ethereum: EthereumProvider
): Promise<string> => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" })
  return accounts[0]
}

export const executePhantomUSDCProvider = async (
  provider: PhantomProvider,
  paymentApi: PaymentApi,
  payinId: string,
  amount: number,
  cancelPayinCallback: () => Promise<void>
) => {
  const res = await window.solana.connect()
  const response = await paymentApi.entryPhantomCircleUSDC({
    phantomCircleUSDCEntryRequestDto: {
      payinId
    }
  })
  try {
    await sendAndGenerateSolanaTokenTransactionMessage(
      response.networkUrl,
      response.depositAddress,
      res.publicKey,
      response.tokenAddress,
      amount,
      provider
    )
  } catch (error) {
    cancelPayinCallback()
    throw error
  }
}

export const executeMetamaskUSDCProvider = async (
  account: string,
  provider: EthereumProvider,
  paymentApi: PaymentApi,
  payinId: string,
  amount: number,
  cancelPayinCallback: () => Promise<void>
) => {
  let depositAddress = ""
  let tokenAddress = ""
  let chainId = ""
  const response = await paymentApi.entryMetamaskCircleUSDC({
    metamaskCircleUSDCEntryRequestDto: {
      payinId
    }
  })
  depositAddress = response.depositAddress
  tokenAddress = response.tokenAddress
  chainId = "0x" + response.chainId.toString(16)
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }]
    })
    await sendAndGenerateEthereumTokenTransactionMessage(
      account,
      depositAddress,
      tokenAddress,
      amount,
      chainId,
      provider
    )
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    // if it is not, then install it into the user MetaMask
    cancelPayinCallback()
    if (error.code === 4902) {
      //TODO: ask to add chain
      throw Error("chain is not added to wallet")
    } else {
      throw error
    }
  }
}

export const executeMetamaskEthProvider = async (
  account: string,
  provider: EthereumProvider,
  paymentApi: PaymentApi,
  payinId: string,
  amount: number,
  cancelPayinCallback: () => Promise<void>
) => {
  let depositAddress = ""
  let chainId = ""
  const response = await paymentApi.entryMetamaskCircleETH({
    metamaskCircleETHEntryRequestDto: {
      payinId
    }
  })
  depositAddress = response.depositAddress
  chainId = "0x" + response.chainId.toString(16)
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }]
    })
    await sendAndGenerateEthereumTransactionMessage(
      account,
      depositAddress,
      amount,
      chainId,
      provider
    )
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    // if it is not, then install it into the user MetaMask
    cancelPayinCallback()
    if (error.code === 4902) {
      //TODO: ask to add chain
      throw Error("chain is not added to wallet")
    } else {
      throw error
    }
  }
}
