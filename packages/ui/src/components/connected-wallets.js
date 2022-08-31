import { WalletApi } from "@passes/api-client"
import { ethers } from "ethers"
import { toast } from "react-toastify"
import { Button } from "src/components/atoms"
import { useUserConnectedWallets } from "src/hooks"

import { wrapApi } from "../helpers/wrapApi"

const WalletSettings = () => {
  const { wallets, mutate } = useUserConnectedWallets()

  const handleOnETHWalletConnect = async () => {
    try {
      if (!window.ethereum) {
        alert("Metamask is not installed!")
        return
      }

      await window.ethereum.send("eth_requestAccounts")

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const walletAddress = await signer.getAddress()
      const rawMessage = await getMessageToSign(walletAddress, "eth")

      if (!rawMessage) {
        alert("Failed to get message to sign from API")
        return
      }

      const signature = await signer.signMessage(rawMessage)

      const createWalletDto = {
        walletAddress,
        signedMessage: signature,
        rawMessage: rawMessage,
        chain: "eth"
      }

      const api = wrapApi(WalletApi)
      await api.walletCreate({ createWalletDto })
      mutate()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleOnSolanaWalletConnect = async () => {
    try {
      if (!window.solana) {
        alert("Phantom is not installed!")
        return
      }

      const connectResponse = await window.solana.connect()
      const walletAddress = connectResponse.publicKey.toString()
      const rawMessage = await getMessageToSign(walletAddress, "sol")

      if (!rawMessage) {
        alert("Failed to get message to sign from API")
        return
      }

      const encodedMessage = new TextEncoder().encode(rawMessage)
      const signedMessage = await window.solana.request({
        method: "signMessage",
        params: {
          message: encodedMessage,
          display: "utf8"
        }
      })

      const signature = Buffer.from(signedMessage.signature).toString("utf8")

      const createWalletDto = {
        walletAddress,
        signedMessage: signature,
        rawMessage,
        chain: "sol"
      }

      const api = wrapApi(WalletApi)
      await api.walletCreate({ createWalletDto })
      mutate()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const getMessageToSign = async (walletAddress, chain) => {
    try {
      const api = wrapApi(WalletApi)
      const res = await api.walletAuth({
        authWalletRequestDto: { walletAddress, chain }
      })

      return res.rawMessage
    } catch (err) {
      console.log(err)
      toast.error(err)
    }
  }

  return (
    <div>
      <Button
        className="mt-4 w-full max-w-sm border border-mauve-mauve12 !px-6 !py-5 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white dark:border-mauveDark-mauve11 dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
        fontSize={16}
        onClick={handleOnETHWalletConnect}
      >
        Connect MetaMask
      </Button>
      <Button
        className="mt-4 w-full max-w-sm border border-mauve-mauve12 !px-6 !py-5 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white dark:border-mauveDark-mauve11 dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
        fontSize={16}
        onClick={handleOnSolanaWalletConnect}
      >
        Connect Phantom
      </Button>
      <div className="pt-4">
        <h1 className="font-bold">Your Connected Wallets</h1>
        {wallets.map((w) => (
          <p key={w.address}>{w.address}</p>
        ))}
      </div>
    </div>
  )
}

export default WalletSettings
