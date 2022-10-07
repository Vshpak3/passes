import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import { ethers } from "ethers"

import { ERC20ABI } from "./ABI"
import { EthereumProvider, PhantomProvider } from "./wallet-setup"

export const generateSolanaTokenTransactionMessage = async (
  connection: Connection,
  depositAddress: string,
  ownerAccount: PublicKey,
  token: string,
  amount: number
): Promise<Transaction> => {
  const from = ownerAccount
  const transaction = new Transaction()
  const mint = new PublicKey(token)
  const to = new PublicKey(depositAddress)
  const blockhash = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash.blockhash
  transaction.feePayer = ownerAccount
  const fromTokenAddress = await getAssociatedTokenAddress(mint, from)
  transaction.add(
    createTransferInstruction(
      fromTokenAddress,
      to,
      from,
      amount,
      [],
      TOKEN_PROGRAM_ID
    )
  )

  return transaction
}

export const sendAndGenerateSolanaTokenTransactionMessage = async (
  network: string,
  depositAddress: string,
  ownerAccount: PublicKey,
  token: string,
  amount: number,
  provider: PhantomProvider
): Promise<void> => {
  const connection = new Connection(network)
  const transaction = await generateSolanaTokenTransactionMessage(
    connection,
    depositAddress,
    ownerAccount,
    token,
    amount
  )
  await provider.signAndSendTransaction(transaction)
  // TODO:
  // eslint-disable-next-line no-console
  // console.log(await connection.getSignatureStatus(signature))
}

export const sendAndGenerateEthereumTokenTransactionMessage = async (
  from: string,
  depositAddress: string,
  token: string,
  amount: number,
  chainId: string,
  provider: EthereumProvider
): Promise<void> => {
  const transactionParameters = {
    to: token,
    from: from,
    value: "0x00",
    data: "",
    chainId: chainId
  }
  const contract = new ethers.Contract(token, ERC20ABI)
  const transaction = await contract.populateTransaction.transfer(
    depositAddress,
    ethers.BigNumber.from(amount)
  )
  transactionParameters.data = transaction.data as string
  await provider.request({
    method: "eth_sendTransaction",
    params: [transactionParameters]
  })
  // await provider.request({
  //   method: "eth_sendTransaction",
  //   params: [transactionParameters]
  // })
}

export const sendAndGenerateEthereumTransactionMessage = async (
  from: string,
  depositAddress: string,
  amount: number,
  chainId: string,
  provider: EthereumProvider
): Promise<void> => {
  const transactionParameters = {
    to: depositAddress,
    from: from,
    value: "0x" + amount.toString(16),
    chainId: chainId
  }
  await provider.request({
    method: "eth_sendTransaction",
    params: [transactionParameters]
  })
}
