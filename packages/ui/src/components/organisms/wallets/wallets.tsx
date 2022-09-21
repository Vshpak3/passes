import {
  CreateWalletRequestDto,
  GetWalletsResponseDto,
  PaymentApi,
  WalletApi
} from "@passes/api-client"
import { ethers } from "ethers"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
import Wallet from "public/icons/wallet-manage.svg"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, ButtonTypeEnum, Input } from "src/components/atoms"
import Modal from "src/components/organisms/Modal"
import { wrapApi } from "src/helpers"
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
  payoutWalletId?: string
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

  const confirmNewPayoutAddressOnSubmit = async () => {
    const walletAddress = getValues("payoutAddress")
    const api = wrapApi(WalletApi)
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
    const api = wrapApi(WalletApi)
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
    const walletApi = wrapApi(WalletApi)
    const payoutApi = wrapApi(PaymentApi)

    Promise.all([
      payoutApi.getDefaultPayoutMethod(),
      walletApi.getDefaultWallet({
        getDefaultWalletRequestDto: {
          chain: "eth"
        }
      }),
      walletApi.getDefaultWallet({
        getDefaultWalletRequestDto: {
          chain: "sol"
        }
      })
    ])
      .then((response) => {
        return setDefaultAddress({
          payoutWalletId: response[0].walletId,
          miningEthereumWalletId: response[1].walletId,
          miningSolanaWalletId: response[2].walletId
        })
      })
      .catch(({ message }) => toast(message))
  }, [])

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
      <div className="mt-[50px] flex items-center justify-start">
        <div className="flex items-center">
          <Phantom className="ml-[37px] h-[50px] w-[50px]" />
          <Metamask className="ml-[30px] mr-[25px] h-[50px] w-[50px]" />
          <Button variant="purple" onClick={() => setIsModalOpen(true)}>
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
        <span className="mr-[80px] ml-[80px]">Address</span>
        <span className="ml-[80px]">Default For</span>
        <span>Delete</span>
      </div>
      <WalletsList
        walletsList={walletsList}
        deleteWalletHandler={deleteWalletHandler}
        isCreator={user?.isCreator}
        defaultPayoutWalletId={payoutWalletId}
        miningSolanaWalletId={miningSolanaWalletId}
        miningEthereumWalletId={miningEthereumWalletId}
      />
    </div>
  )
}

export default Wallets
