import {
  CreateWalletRequestDto,
  CreateWalletRequestDtoChainEnum,
  WalletApi
} from "@passes/api-client"
import { ethers } from "ethers"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
import Wallet from "public/icons/wallet-manage.svg"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Select } from "src/components/atoms/input/Select"
import { Modal } from "src/components/organisms/Modal"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks/useUser"
import { useUserConnectedWallets } from "src/hooks/useUserConnectedWallets"
import { useUserDefaultMintingWallets } from "src/hooks/useUserDefaultMintingWallet"
import { WalletListItem } from "./WalletsList/WalletListItem"

export const Wallets = () => {
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
        toast.error("Metamask is not installed!")
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (window.ethereum as any).send("eth_requestAccounts")

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const walletAddress = await signer.getAddress()
      const rawMessage = await getMessageToSign(walletAddress, "eth")

      if (!rawMessage) {
        toast.error("Failed to get message to sign from API")
        return
      }

      const signature = await signer.signMessage(rawMessage)

      const createWalletDto: CreateWalletRequestDto = {
        walletAddress,
        signedMessage: signature,
        rawMessage: rawMessage,
        chain: CreateWalletRequestDtoChainEnum.Eth
      }

      const api = new WalletApi()
      await api.createWallet({ createWalletRequestDto: createWalletDto })
      mutate()
    } catch (error) {
      errorMessage(error, true)
    }
  }

  const handleOnSolanaWalletConnect = async () => {
    setIsModalOpen(false)
    try {
      if (!window.solana) {
        toast.error("Phantom is not installed!")
        return
      }

      const connectResponse = await window.solana.connect()
      const walletAddress = connectResponse.publicKey.toString()
      const rawMessage = await getMessageToSign(walletAddress, "sol")

      if (!rawMessage) {
        toast.error("Failed to get message to sign from API")
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
        chain: CreateWalletRequestDtoChainEnum.Sol
      }

      const api = new WalletApi()
      await api.createWallet({ createWalletRequestDto: createWalletDto })
      mutate()
    } catch (error) {
      errorMessage(error, true)
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
    } catch (error) {
      errorMessage(error, true)
    }
  }

  const confirmNewPayoutAddressOnSubmit = async () => {
    const walletAddress = getValues("address")
    const chain = getValues("chain").toLowerCase()
    const api = new WalletApi()
    await api
      .createUnauthenticatedWallet({
        createUnauthenticatedWalletRequestDto: {
          walletAddress,
          chain
        }
      })
      .catch((error) => errorMessage(error, true))
    setValue("address", "")
    await setTimeout(() => undefined, 50)
    mutate().catch((error) => errorMessage(error, true))
  }

  const deleteWalletHandler = async (id: string) => {
    const api = new WalletApi()
    await api.removeWallet({ walletId: id }).catch((error) => {
      errorMessage(error, true)
    })
    await setTimeout(() => undefined, 50)
    mutate()
  }

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        modalContainerClassname="rounded-[15px]"
        setOpen={setIsModalOpen}
      >
        <div className="md:px-10 md:pb-10">
          <h4 className="mt-5 text-center text-2xl font-bold dark:text-white">
            Choose Wallet to Connect
          </h4>
          <div className="mt-6 flex flex-col items-center justify-start md:mt-10 md:flex-row md:justify-center md:space-x-7">
            <div
              className="flex cursor-pointer items-center space-x-4 rounded-full px-3 py-2 hover:bg-gray-700"
              onClick={handleOnETHWalletConnect}
            >
              <Metamask className="cursor-pointer" width="34px" />
              <span className="text-xl font-bold">Metamask</span>
            </div>
            <div
              className="flex cursor-pointer items-center space-x-4 rounded-full px-3 py-2 hover:bg-gray-700"
              onClick={handleOnSolanaWalletConnect}
            >
              <Phantom className="h-[34px] w-[34px]" />
              <span className="text-xl font-bold">Phantom</span>
            </div>
          </div>
        </div>
      </Modal>
      <div className="mt-4 flex w-full flex-col items-start justify-start md:flex-row">
        <div>
          <Button
            className="mt-1"
            onClick={() => setIsModalOpen(true)}
            tag="button"
            variant="pink"
          >
            <div className="flex items-center justify-center">
              <div className="block w-[24px]">
                <Wallet className="h-[24px] w-[24px]" />
              </div>
              <span className="ml-[10px] block">Connect New Wallet</span>
            </div>
          </Button>
        </div>
        {!!user?.isCreator && (
          <form
            className="flex w-full flex-col items-start md:flex-row"
            onSubmit={handleSubmit(confirmNewPayoutAddressOnSubmit)}
          >
            <span className="mx-4 my-2 mt-3 block text-[16px] font-bold md:my-3">
              or
            </span>
            <div className="flex w-full flex-row md:basis-1">
              <div className="mr-2 basis-4/5 md:basis-1">
                <Input
                  className="mr-3 pl-[45px] md:w-[250px]"
                  errors={errors}
                  icon={<Wallet />}
                  name="address"
                  options={{
                    required: {
                      message: "Payout Address is required",
                      value: true
                    }
                  }}
                  placeholder="Insert your Payout Address"
                  register={register}
                  type="text"
                />
              </div>
              <div className="basis-1/5">
                <Select
                  className="mr-3 mt-0 w-[80px]"
                  defaultValue="SOL"
                  errors={errors}
                  name="chain"
                  onChange={(newValue: string) => setValue("chain", newValue)}
                  options={{
                    required: { message: "Chain is required", value: true }
                  }}
                  register={register}
                  selectOptions={["SOL", "ETH"]}
                />
              </div>
            </div>
            <div className="mt-2">
              <Button tag="button" type={ButtonTypeEnum.SUBMIT} variant="pink">
                Confirm
              </Button>
            </div>
          </form>
        )}
      </div>
      <div className="overflow-x-scroll md:overflow-x-auto">
        <div className="mt-6 flex w-[600px] gap-0 pt-1 text-center text-[#ffffffeb] md:w-full md:gap-[40px] md:pl-8">
          <span className="flex basis-1/4 justify-center">Wallet Type</span>
          <span className="flex basis-1/4 justify-center">Address</span>
          <span className="flex basis-1/4 justify-center">Default For</span>
          <span className="flex basis-1/4 justify-center">Delete</span>
        </div>
        {loading || !wallets ? (
          <span className="mt-4">Loading...</span>
        ) : (
          <div className="mt-1 place-items-center justify-center text-center text-[#ffffffeb]">
            {wallets.map((wallet) => {
              return (
                <WalletListItem
                  defaultEthMinting={ethWallet?.walletId === wallet.walletId}
                  defaultSolMinting={solWallet?.walletId === wallet.walletId}
                  deleteWalletHandler={deleteWalletHandler}
                  key={wallet.walletId}
                  setDefaultMinting={setDefaultWallet}
                  wallet={wallet}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
