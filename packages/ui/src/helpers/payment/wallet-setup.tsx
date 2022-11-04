import { PaymentApi } from "@passes/api-client"

import type {
  EthereumProvider,
  PhantomProvider
} from "src/helpers/crypto/types"
import {
  sendAndGenerateEthereumTokenTransactionMessage,
  sendAndGenerateEthereumTransactionMessage,
  sendAndGenerateSolanaTokenTransactionMessage
} from "./transactions"

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
  const res = await provider.connect()
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
  const response = await paymentApi.entryMetamaskCircleUSDC({
    metamaskCircleUSDCEntryRequestDto: {
      payinId
    }
  })
  const chainId = "0x" + response.chainId.toString(16)
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainId }]
    })
    await sendAndGenerateEthereumTokenTransactionMessage(
      account,
      response.depositAddress,
      response.tokenAddress,
      amount,
      chainId,
      provider
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
