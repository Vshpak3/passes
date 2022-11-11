import { CreateWalletRequestDtoChainEnum } from "@passes/api-client"
import { ethers } from "ethers"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
import Wallet from "public/icons/wallet-manage.svg"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Select } from "src/components/atoms/input/Select"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { Modal } from "src/components/organisms/Modal"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks/useUser"
import { useUserConnectedWallets } from "src/hooks/useUserConnectedWallets"
import { WalletTableRow } from "./WalletTableRow"

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

  const {
    wallets,
    loading,
    addWallet,
    addUnauthenticatedWallet,
    deleteWallet,
    getMessageToSign
  } = useUserConnectedWallets()

  const [walletIdDelete, setWalletIdDelete] = useState<string | null>(null)

  const handleOnETHWalletConnect = async () => {
    setIsModalOpen(false)
    try {
      if (!window.ethereum || !window.ethereum.request) {
        toast.error("Metamask is not installed!")
        return
      }

      await window.ethereum.request({ method: "eth_requestAccounts" })

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const walletAddress = await signer.getAddress()
      const rawMessage = await getMessageToSign(walletAddress, "eth")

      if (!rawMessage) {
        toast.error("Failed to get message to sign from API")
        return
      }

      const signedMessage = await signer.signMessage(rawMessage)

      addWallet({
        walletAddress,
        signedMessage,
        rawMessage,
        chain: CreateWalletRequestDtoChainEnum.Eth
      })
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

      addWallet({
        walletAddress,
        signedMessage: signature,
        rawMessage,
        chain: CreateWalletRequestDtoChainEnum.Sol
      })
    } catch (error) {
      errorMessage(error, true)
    }
  }

  const confirmNewPayoutAddressOnSubmit = async () => {
    const walletAddress = getValues("address")
    const chain = getValues("chain").toLowerCase()
    await addUnauthenticatedWallet({
      walletAddress,
      chain
    }).catch((error) => errorMessage(error, true))
    setValue("address", "")
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        modalContainerClassname="rounded-[15px]"
        setOpen={setIsModalOpen}
      >
        <div className="md:px-10 md:pb-20">
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
      <div className="mt-4 flex w-full flex-col items-start justify-start xl:flex-row">
        <div>
          <Button
            className="mt-1 rounded-md"
            onClick={() => setIsModalOpen(true)}
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
            className="flex w-full flex-col items-stretch xl:flex-row"
            onSubmit={handleSubmit(confirmNewPayoutAddressOnSubmit)}
          >
            <span className="m-2 mt-3 block text-[16px] font-bold md:my-3 xl:mx-4">
              or
            </span>
            <div className="flex h-full w-full flex-row md:basis-1">
              <div className="mr-2 basis-4/5 md:basis-1">
                <Input
                  className="border-[#3A444C]/30 bg-[#18090E] pl-[45px] md:w-[250px]"
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
                  className="mr-3 mt-0 w-[80px] bg-[#18090E]"
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
            <div className="mt-2 xl:ml-2">
              <Button className="rounded-md" type={ButtonTypeEnum.SUBMIT}>
                Confirm
              </Button>
            </div>
          </form>
        )}
      </div>
      <div className="mt-8 min-h-[200px] overflow-x-scroll">
        <table className="min-w-full pb-6 md:overflow-x-auto">
          <thead>
            <tr>
              <th />
              <th className="min-w-[150px] pb-3">Wallet Type</th>
              <th className="min-w-[150px] pb-3">Address</th>
              <th className="min-w-[150px] pb-3">Default For</th>
              <th className="min-w-[150px] pb-3">Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading || !wallets ? (
              <tr className="mt-4">
                <td>Loading...</td>
              </tr>
            ) : (
              wallets.map((wallet) => (
                <WalletTableRow
                  deleteWalletHandler={setWalletIdDelete}
                  key={wallet.walletId}
                  wallet={wallet}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      {!!walletIdDelete && (
        <DeleteConfirmationModal
          isOpen={!!walletIdDelete}
          onClose={() => setWalletIdDelete(null)}
          onDelete={async () => {
            await deleteWallet(walletIdDelete)
            toast.success("Wallet has been removed")
          }}
        />
      )}
    </>
  )
}
