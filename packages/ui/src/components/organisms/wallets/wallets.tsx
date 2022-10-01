import { CreateWalletRequestDto, WalletApi } from "@passes/api-client"
import { ethers } from "ethers"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
import Wallet from "public/icons/wallet-manage.svg"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, ButtonTypeEnum, Input, Select } from "src/components/atoms"
import Modal from "src/components/organisms/Modal"
import { useUser, useUserDefaultMintingWallets } from "src/hooks"
import useUserConnectedWallets from "src/hooks/useUserConnectedWallets"

import WalletListItem from "./WalletsList/WalletListItem"

const Wallets = () => {
  const { user } = useUser()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const { ethWallet, solWallet, setDefaultWallet } =
    useUserDefaultMintingWallets()
  const { wallets, mutate, loading } = useUserConnectedWallets()

  const handleOnETHWalletConnect = async () => {
    setIsModalOpen(false)
    try {
      if (!window.ethereum) {
        alert("Metamask is not installed!")
        return
      }

      await (window.ethereum as any).send("eth_requestAccounts")

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
    const walletAddress = getValues("address")
    const chain = getValues("chain")
    console.log(walletAddress)
    console.log(chain)
    const api = new WalletApi()
    await api
      .createUnauthenticatedWallet({
        createUnauthenticatedWalletRequestDto: {
          walletAddress,
          chain
        }
      })
      .catch(({ message }) => toast(message))
    setValue("address", "")
    mutate().catch(({ message }) => toast(message))
  }

  const deleteWalletHandler = async (id: string) => {
    const api = new WalletApi()
    await api.removeWallet({ walletId: id }).catch(({ message }) => {
      console.error(message)
      toast.error(message)
    })
    mutate()
  }

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
              name="address"
              register={register}
              placeholder="Add Unchecked Address"
              iconMargin="15"
              errors={errors}
              options={{
                required: { message: "need payout address", value: true }
              }}
            />
            <Select
              name="chain"
              register={register}
              selectOptions={["sol", "eth"]}
              errors={errors}
              options={{
                required: { message: "need chain", value: true }
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
      {loading || !wallets ? (
        <span>Loading...</span>
      ) : (
        <div
          className="
            mt-[11px]
            ml-[31px]
            place-items-center
            justify-center
            gap-[40px]
            text-center
            text-[12px]
            text-[#ffffffeb]"
        >
          {wallets.map((wallet) => {
            return (
              <WalletListItem
                wallet={wallet}
                deleteWalletHandler={deleteWalletHandler}
                defaultSolMinting={solWallet?.walletId === wallet.walletId}
                defaultEthMinting={ethWallet?.walletId === wallet.walletId}
                key={wallet.walletId}
                setDefaultMinting={setDefaultWallet}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Wallets
