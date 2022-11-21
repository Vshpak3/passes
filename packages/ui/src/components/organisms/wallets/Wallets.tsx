import { yupResolver } from "@hookform/resolvers/yup"
import {
  CreateUnauthenticatedWalletRequestDtoChainEnum,
  CreateWalletRequestDtoChainEnum
} from "@passes/api-client"
import { ethers } from "ethers"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
import Wallet from "public/icons/wallet-manage.svg"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { object, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { Input } from "src/components/atoms/input/GeneralInput"
import { SelectInput } from "src/components/atoms/input/SelectInput"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { Dialog } from "src/components/organisms/Dialog"
import { errorMessage } from "src/helpers/error"
import { useUser } from "src/hooks/useUser"
import { useUserConnectedWallets } from "src/hooks/useUserConnectedWallets"
import { WalletTableRow } from "./WalletTableRow"

const walletSchema = object({
  chain: string().required("Chain is required"),
  walletAddress: string().required("A payout address is required")
})

interface WalletForm {
  chain: CreateUnauthenticatedWalletRequestDtoChainEnum
  walletAddress: string
}

export const Wallets = () => {
  const { user } = useUser()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<WalletForm>({
    defaultValues: { chain: CreateWalletRequestDtoChainEnum.Sol },
    resolver: yupResolver(walletSchema)
  })

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

  const confirmNewPayoutAddressOnSubmit = async (values: WalletForm) => {
    await addUnauthenticatedWallet(values).catch((error) =>
      errorMessage(error, true)
    )
    reset()
  }

  return (
    <>
      <Dialog
        className="border border-white/10 bg-passes-black px-6 py-5 md:rounded-lg"
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
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
      </Dialog>
      <form
        className="mt-4 flex w-full flex-row flex-wrap items-start justify-start gap-2"
        onSubmit={handleSubmit(confirmNewPayoutAddressOnSubmit)}
      >
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
          <>
            <span className="m-2 mt-3 block text-[16px] font-bold md:my-3 xl:mx-4">
              or
            </span>
            <div className="flex h-full w-full basis-1 flex-row">
              <div className="mr-2 basis-1">
                <Input
                  className="w-[250px] border-[#3A444C]/30 bg-[#18090E] pl-[45px]"
                  errors={errors}
                  icon={<Wallet />}
                  name="walletAddress"
                  outerClassName=""
                  placeholder="Insert your Payout Address"
                  register={register}
                  type="text"
                />
              </div>
              <div className="basis-1/5">
                <SelectInput
                  className="mr-3 mt-0 w-[80px] bg-[#18090E]"
                  control={control}
                  defaultValue="SOL"
                  errors={errors}
                  name="chain"
                  selectOptions={["SOL", "ETH"]}
                />
              </div>
            </div>
            <div className="mt-2 xl:ml-2">
              <Button className="rounded-md" type={ButtonTypeEnum.SUBMIT}>
                Confirm
              </Button>
            </div>
          </>
        )}
      </form>
      <div className="mt-8 min-h-[200px] overflow-x-auto">
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
