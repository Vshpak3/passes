import {
  CreateWalletRequestDto,
  GetWalletsResponseDto,
  PaymentApi,
  WalletApi
} from "@passes/api-client"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
import Wallet from "public/icons/wallet-manage.svg"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, ButtonTypeEnum, Input } from "src/components/atoms"
import Modal from "src/components/organisms/Modal"
import { useUser } from "src/hooks"
import useUserConnectedWallets from "src/hooks/useUserConnectedWallets"
import { KeyedMutator } from "swr"

import WalletsList from "./WalletsList/WalletsList"

interface Wallet {
  walletId: string
  address: string
  chain: string
  custodial: number
  authenticated: number
  userId?: string
}

interface ConnectedWallets {
  wallets: GetWalletsResponseDto | WalletsResponse
  loading: boolean
  mutate: KeyedMutator<GetWalletsResponseDto>
}

interface WalletsResponse {
  wallets: GetWalletsResponseDto | unknown[]
}

interface DefaultPayoutMiningAddress {
  payoutWalletId?: string | null
  miningSolanaWalletId?: string
  miningEthereumWalletId?: string
}

const Wallets = () => {
  const { user } = useUser()
  const [walletsList, setWalletsList] = useState<Wallet[]>([])
  const [defaultAddress, setDefaultAddress] =
    useState<DefaultPayoutMiningAddress>({} as DefaultPayoutMiningAddress)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const { miningSolanaWalletId, miningEthereumWalletId, payoutWalletId } =
    defaultAddress
  const { wallets, loading, mutate }: ConnectedWallets =
    useUserConnectedWallets()

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

      const { ethers } = await import("ethers").then((mod) => mod.default)

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

      const api = new WalletApi()
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

      const api = new WalletApi()
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
      const api = new WalletApi()
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

  const confirmNewPayoutAddressOnSubmit = async () => {
    const walletAddress = getValues("payoutAddress")
    const api = new WalletApi()
    await api
      .createUnauthenticatedWallet({
        createUnauthenticatedWalletRequestDto: {
          walletAddress,
          chain: "eth"
        }
      })
      .catch(({ message }) => toast(message))
    setValue("payoutAddress", "")
    mutate().catch(({ message }) => toast(message))
  }

  const deleteWalletHandler = async (id: string) => {
    const api = new WalletApi()
    setWalletsList((prevState) =>
      prevState.filter(({ walletId }) => walletId !== id)
    )
    return await api.removeWallet({ walletId: id }).catch(({ message }) => {
      console.error(message)
      toast.error(message)
    })
  }

  useEffect(() => {
    setWalletsList(wallets.wallets as Wallet[])
  }, [wallets, loading])

  useEffect(() => {
    const walletApi = new WalletApi()
    const payoutApi = new PaymentApi()

    payoutApi
      .getDefaultPayoutMethod()
      .then(({ walletId }) => {
        return setDefaultAddress((prevState) => ({
          ...prevState,
          payoutWalletId: walletId
        }))
      })
      .catch(({ message }) => toast(message))

    walletApi
      .getDefaultWallet({
        getDefaultWalletRequestDto: {
          chain: "eth"
        }
      })
      .then(({ walletId }) => {
        return setDefaultAddress((prevState) => ({
          ...prevState,
          miningEthereumWalletId: walletId
        }))
      })
      .catch(({ message }) => toast(message))

    walletApi
      .getDefaultWallet({
        getDefaultWalletRequestDto: {
          chain: "sol"
        }
      })
      .then(({ walletId }) => {
        return setDefaultAddress((prevState) => ({
          ...prevState,
          miningSolanaWalletId: walletId
        }))
      })
      .catch(({ message }) => toast(message))
  }, [])

  return (
    <div>
      <Modal
        modalContainerClassname="rounded-[20px]"
        isOpen={isModalOpen}
        setOpen={setIsModalOpen}
      >
        <div className="px-10 pb-10">
          <h4 className="mt-5 text-center text-2xl font-bold dark:text-white">
            Choose Wallet to Connect
          </h4>
          <div className="mt-10 flex items-center justify-center space-x-7">
            <div className="flex items-center space-x-4">
              <Metamask
                className="h-[34px] w-[34px] cursor-pointer"
                onClick={handleOnETHWalletConnect}
              />
              <span className="text-xl font-bold">Metamask</span>
            </div>
            <div className="flex items-center space-x-4">
              <Phantom
                className="h-[34px] w-[34px] cursor-pointer"
                onClick={handleOnSolanaWalletConnect}
              />
              <span className="text-xl font-bold">Phantom</span>
            </div>
          </div>
        </div>
      </Modal>
      <div className="mt-[50px] flex items-center justify-start">
        <div className="flex items-center">
          <Phantom className="ml-[25px]" />
          <Metamask className="ml-[30px] mr-[25px]" />
          <Button
            className="h-[36px] border-none"
            variant="purple"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex items-center justify-center">
              <Wallet className="block h-[24px] w-[24px]" />
              <span className="ml-[10px] block">Connect New Wallet</span>
            </div>
          </Button>
        </div>
        {!!user?.isCreator && (
          <form
            onSubmit={handleSubmit(confirmNewPayoutAddressOnSubmit)}
            className="ml-[25px] flex w-fit items-center"
          >
            <span className="block text-[16px] font-bold">or</span>
            <Input
              className="
                mt-5
                block
                h-[36px]
                w-[215px]
                cursor-pointer
                rounded-[6px]
                border
                border-passes-gray-100
                bg-black
                pl-[45px]
                text-[12px]
                text-base
                font-bold
                text-white
                outline-none
                md:mt-0
                md:ml-4"
              icon={<Wallet />}
              type="text"
              name="payoutAddress"
              register={register}
              placeholder="Insert Your Payout Address"
              iconMargin="15"
              errors={errors}
              options={{
                required: { message: "need payout address", value: true }
              }}
            />
            <Button
              type={ButtonTypeEnum.SUBMIT}
              className="ml-[25px] h-[36px] min-w-[100px] text-[14px]"
              variant="pink"
              tag="button"
            >
              Confirm
            </Button>
          </form>
        )}
      </div>
      <div
        className="
          ml-[40px]
          mr-[120px]
          mt-[83px]
          flex
          w-full
          items-center
          justify-around
          pr-[35px]
          pl-[20px]
          pt-[11px]
          text-center
          text-[12px]
          text-[#ffffffeb]"
      >
        <span className="block">Wallet Type</span>
        <span className="mx-[135px] block">Address</span>
        <span className="block">Default For</span>
        <span className="block">Delete</span>
      </div>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <WalletsList
          walletsList={walletsList}
          deleteWalletHandler={deleteWalletHandler}
          isCreator={!!user?.isCreator}
          defaultPayoutWalletId={payoutWalletId}
          miningSolanaWalletId={miningSolanaWalletId}
          miningEthereumWalletId={miningEthereumWalletId}
        />
      )}
    </div>
  )
}

export default Wallets
