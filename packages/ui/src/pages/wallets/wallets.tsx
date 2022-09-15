import {
  CreateWalletRequestDto,
  GetWalletsResponseDto,
  WalletApi
} from "@passes/api-client"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import Arrow from "public/icons/arrow-back.svg"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
import Wallet from "public/icons/wallet-manage.svg"
import React, { FocusEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button } from "src/components/atoms"
import Modal from "src/components/organisms/Modal"
import { wrapApi } from "src/helpers"
import useUserConnectedWallets from "src/hooks/useUserConnectedWallets"
import useUserDefaultWallet from "src/hooks/useUserDefaultWallet"
import { KeyedMutator } from "swr"

import WalletsList from "./WalletsList/WalletsList"

interface DefaultWallet {
  address: string
  authenticated: number
  chain: string
  custodial: number
  id: string
  userId: string
}

interface Wallet {
  walletId: string
  userId?: string
  address: string
  chain: string
  custodial: boolean
  authenticated: boolean
}

interface ConnectedWallets {
  wallets: GetWalletsResponseDto | WalletsResponse
  loading: boolean
  mutate: KeyedMutator<GetWalletsResponseDto>
}

interface WalletsResponse {
  wallets: GetWalletsResponseDto | unknown[]
}

const Wallets = () => {
  const [walletsList, setWalletsList] = useState<Wallet[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const router = useRouter()
  const { register } = useForm()
  const { wallets, loading, mutate }: ConnectedWallets =
    useUserConnectedWallets()
  const { wallet: defaultWallet } = useUserDefaultWallet()
  const { address } = defaultWallet as DefaultWallet

  const handleOnETHWalletConnect = async () => {
    setIsModalOpen(false)
    try {
      if (!window.ethereum) {
        alert("Metamask is not installed!")
        return
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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

      const createWalletDto: CreateWalletRequestDto = {
        walletAddress,
        signedMessage: signature,
        rawMessage: rawMessage,
        chain: "eth"
      }

      const api = wrapApi(WalletApi)
      await api.createWallet({ createWalletRequestDto: createWalletDto })
      mutate()
    } catch ({ type, message }) {
      toast.error(message as string)
    }
  }

  const handleOnSolanaWalletConnect = async () => {
    setIsModalOpen(false)
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

      const createWalletDto: CreateWalletRequestDto = {
        walletAddress,
        signedMessage: signature,
        rawMessage,
        chain: "sol"
      }

      const api = wrapApi(WalletApi)
      await api.createWallet({ createWalletRequestDto: createWalletDto })
      mutate()
    } catch ({ type, message }) {
      toast.error(message as string)
    }
  }

  const getMessageToSign = async (
    walletAddress: string,
    chain: "eth" | "sol" | "avax" | "matic"
  ) => {
    try {
      const api = wrapApi(WalletApi)
      const res = await api.authMessage({
        authWalletRequestDto: {
          walletAddress,
          chain: chain
        }
      })
      return res.rawMessage
    } catch ({ type, message }) {
      toast.error(message as string)
    }
  }

  const historyBack = () => router.back()

  const selectWalletHandler = (value: string) => {
    setSelectedAddress(value)
  }

  const deleteWalletHandler = async (id: string) => {
    const api = wrapApi(WalletApi)
    setWalletsList((prevState) =>
      prevState.filter(({ walletId }) => walletId !== id)
    )
    return await api.removeWallet({ walletId: id }).catch(({ message }) => {
      console.error(message)
      toast.error(message)
    })
  }

  const closeOnOutsideClick = (event: FocusEvent<HTMLInputElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node))
      setSelectedAddress(null)
  }

  useEffect(() => {
    setWalletsList(wallets.wallets as Wallet[])
  }, [wallets, loading])

  return (
    <div>
      <Modal isOpen={isModalOpen} setOpen={setIsModalOpen}>
        <div className="flex flex-col items-center justify-center">
          <Metamask
            className="m-[10px] h-[100px] w-[100px] cursor-pointer"
            onClick={handleOnETHWalletConnect}
          />
          <Phantom
            className="m-[10px] h-[100px] w-[100px] cursor-pointer"
            onClick={handleOnSolanaWalletConnect}
          />
        </div>
      </Modal>
      <div
        onClick={historyBack}
        className="
          -mt-[180px]
          ml-[64px]
          flex
          cursor-pointer
          items-center
          justify-start
          px-2
          md:px-5
          sidebar-collapse:-mt-[150px]"
      >
        <Arrow className="mr-[21px]" />
        <div className="text-[24px] font-bold text-white">Wallet</div>
      </div>
      <div className="mt-[150px] flex items-center">
        <Phantom className="ml-[37px] h-[50px] w-[50px]" />
        <Metamask className="ml-[30px] h-[50px] w-[50px]" />
        <button
          onClick={() => setIsModalOpen(true)}
          className='
            "flex shadow-sm"
            ml-[25px]
            cursor-pointer
            items-center
            justify-center
            gap-[10px]
            rounded-[50px]
            border-none
            bg-[#9C4DC1]
            py-[12px]
            px-[15px]
            text-base
            font-medium
            text-white'
        >
          <div className="flex items-center justify-center">
            <Wallet className="block h-[24px] w-[24px]" />
            <span className="ml-[10px] block">Connect New Wallet</span>
          </div>
        </button>
      </div>
      <div
        className="
          ml-[80px]
          mr-[120px]
          mt-[83px]
          flex
          items-center
          justify-between
          pr-[35px]
          pl-[20px]
          pt-[11px]
          text-center
          text-[12px]
          text-[#ffffffeb]"
      >
        <span>Wallet Type</span>
        <span className="mr-[80px]">Address</span>
        <span className="ml-[80px]">Default For</span>
        <span>Delete</span>
      </div>
      <WalletsList
        walletsList={walletsList}
        closeOnOutsideClick={closeOnOutsideClick}
        selectedAddress={selectedAddress}
        register={register}
        deleteWalletHandler={deleteWalletHandler}
        selectWalletHandler={selectWalletHandler}
      />
      {address && (
        <div
          className="
            m-[55px]
            flex
            w-[657px]
            rounded-[20px]
            border
            border-[#34343A60]"
        >
          <div className="relative flex w-[175px] items-center">
            <Button variant="pink">Custodial Address</Button>
            <Wallet className="absolute right-[-50px]" />
          </div>
          <input
            className="
              ml-[57px]
              w-full
              bg-transparent
              text-[14px]
              text-[#ffffffeb]"
            readOnly
            value={address}
          />
        </div>
      )}
    </div>
  )
}

export default Wallets
