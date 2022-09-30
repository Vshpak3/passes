import {
  PaymentApi,
  SetDefaultWalletRequestDtoChainEnum,
  WalletApi
} from "@passes/api-client"
import DefaultIcon from "public/icons/defaultWalletTypeIcon.svg"
import InfoIcon from "public/icons/infoIcon.svg"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
import ArrowDown from "public/icons/post-audience-chevron-icon.svg"
import TooltipStar from "public/icons/tooltip-star-icon.svg"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, ButtonTypeEnum } from "src/components/atoms"
import Checkbox from "src/components/atoms/Checkbox"
import IconTooltip from "src/components/atoms/IconTooltip"
import { useOnClickOutside } from "src/hooks"

interface WalletListItemProps {
  walletId: string
  address: string
  chain: string
  custodial: number
  authenticated: number
  deleteWalletHandler: (value: string) => void
  isCreator?: boolean
  defaultPayoutWalletId?: string | null
  miningSolanaWalletId?: string
  miningEthereumWalletId?: string
  userId?: string
}

const SELECT_FAN_OPTIONS = [
  {
    value: "NFT Minting on SOLANA",
    label: "solanaMinting"
  },
  {
    value: "NFT Minting on ETHEREUM",
    label: "ethereumMinting"
  }
]

const SELECT_CREATOR_OPTIONS = [
  {
    value: "Payouts",
    label: "payouts",
    unauthenticatedOnly: true
  },
  {
    value: "NFT Minting on SOLANA",
    label: "solanaMinting"
  },
  {
    value: "NFT Minting on ETHEREUM",
    label: "ethereumMinting"
  }
]

const WalletListItem = ({
  address,
  chain,
  walletId,
  custodial,
  authenticated,
  deleteWalletHandler,
  isCreator,
  defaultPayoutWalletId,
  miningSolanaWalletId,
  miningEthereumWalletId
}: WalletListItemProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState("Select")
  const CUSTODIAL_TOOLTIP_TEXT =
    "This is your custodial address: the address generated by Passes on your behalf, used to store your Passes NFTs."
  const AUTH_TOOLTIP_TEXT =
    "Unauthenticated Wallet: can only be used for Payouts."
  const customSelect = useRef(null)

  const { handleSubmit, getValues, register, setValue } = useForm()
  useOnClickOutside(customSelect, () => setSelectedAddress(null))

  const walletTypeIcon = (value: string, isAuthWallet: boolean) => {
    if (isAuthWallet) {
      switch (value) {
        case "eth":
          return <Metamask />
        case "sol":
          return <Phantom />
      }
    }
    return <DefaultIcon />
  }

  const walletTypeName = (value: string) => {
    if (value) {
      switch (value) {
        case "eth":
          return "Metamask"
        case "sol":
          return "Phantom"
      }
    }
    return value
  }

  const selectListHandler = (isCreator?: boolean, isAuth?: boolean) => {
    if (isCreator && !isAuth) {
      return SELECT_CREATOR_OPTIONS
    }
    return SELECT_FAN_OPTIONS
  }

  const selectWalletHandler = (value: string) => setSelectedAddress(value)

  const onDeleteHandler = () => {
    if (!custodial) {
      deleteWalletHandler(walletId)
    }
  }

  const onSubmitHandler = () => {
    const isPayoutChecked = getValues("payouts")
    const isSolanaMintingChecked = getValues("solanaMinting")
    const isEthereumMintingChecked = getValues("ethereumMinting")
    const payoutApi = new PaymentApi()
    const walletApi = new WalletApi()

    if (
      chain === SetDefaultWalletRequestDtoChainEnum.Sol &&
      selectedAddress &&
      isSolanaMintingChecked
    ) {
      walletApi
        .setDefaultWallet({
          setDefaultWalletRequestDto: {
            chain: SetDefaultWalletRequestDtoChainEnum.Sol,
            walletId: selectedAddress
          }
        })
        .then(() => setSelectedValue("NFT Minting..."))
        .then(() => setSelectedAddress(null))
        .catch(({ message }) => toast(message))
    }

    if (
      chain === SetDefaultWalletRequestDtoChainEnum.Eth &&
      selectedAddress &&
      isEthereumMintingChecked
    ) {
      walletApi
        .setDefaultWallet({
          setDefaultWalletRequestDto: {
            chain: SetDefaultWalletRequestDtoChainEnum.Eth,
            walletId: selectedAddress
          }
        })
        .then(() => setSelectedValue("NFT Minting..."))
        .then(() => setSelectedAddress(null))
        .catch(({ message }) => toast(message))
    }

    if (isCreator && selectedAddress && isPayoutChecked) {
      payoutApi
        .setDefaultPayoutMethod({
          setPayoutMethodRequestDto: {
            method: "none",
            walletId: selectedAddress
          }
        })
        .then(() => setSelectedValue("Payouts"))
        .then(() => setSelectedAddress(null))
        .catch(({ message }) => toast(message))
    }
  }

  useEffect(() => {
    if (walletId === defaultPayoutWalletId && isCreator) {
      setSelectedValue("Payouts")
    }
    if (
      walletId === miningEthereumWalletId ||
      walletId === miningSolanaWalletId
    ) {
      setSelectedValue("NFT Minting...")
    }
    setValue("payouts", defaultPayoutWalletId === walletId)
    setValue("solanaMinting", miningSolanaWalletId === walletId)
    setValue("ethereumMinting", miningEthereumWalletId === walletId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultPayoutWalletId,
    walletId,
    isCreator,
    miningEthereumWalletId,
    miningSolanaWalletId
  ])

  return (
    <>
      <div
        className="
          mb-[11px]
          flex
          items-center
          justify-between
          border-t
          border-[#2C282D]
          pt-[11px]
          pl-[20px]"
        key={walletId}
      >
        <div className="relative flex items-center">
          <div className="absolute left-[-30px] top-[50%] translate-y-[-50%]">
            {!!custodial && (
              <IconTooltip
                Icon={InfoIcon}
                position="top"
                tooltipText={CUSTODIAL_TOOLTIP_TEXT}
                className=""
              />
            )}
          </div>
          <div className="absolute right-[15px] top-[50%] translate-y-[-50%]">
            {!authenticated && isCreator && (
              <IconTooltip
                Icon={TooltipStar}
                position="top"
                tooltipText={AUTH_TOOLTIP_TEXT}
              />
            )}
          </div>
          <div className="mr-[30px] flex w-[135px] items-center">
            <div>{walletTypeIcon(chain, !!authenticated)}</div>
            <span className="ml-[12px] text-[12px] font-bold">
              {walletTypeName(chain)}
            </span>
          </div>
        </div>
        <div className='text-[#ffffffeb]" min-w-[330px] text-left text-[12px]'>
          {address}
        </div>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          tabIndex={0}
          className="relative"
          ref={customSelect}
        >
          <input
            value={selectedValue}
            onClick={() => selectWalletHandler(walletId)}
            readOnly
            className="
              relative
              mt-5
              block
              h-[45px]
              w-[125px]
              cursor-pointer
              rounded-md
              border
              border-passes-gray-100
              bg-black
              p-[10px]
              text-[12px]
              text-base
              text-sm
              font-bold
              text-white
              outline-none
              md:mt-0
              md:ml-4"
          />
          <div
            onClick={() => selectWalletHandler(address)}
            className="
              absolute
              top-[50%]
              right-[12px]
              translate-y-[-50%]
              cursor-pointer"
          >
            <ArrowDown />
          </div>
          {selectedAddress === walletId && (
            <div
              className="
                absolute
                top-[100%]
                left-[15px]
                z-[1]
                w-[338px]
                rounded-[20px]
                border
                border-[#34343A60]
                bg-[#1B141D]
                p-[25px]"
            >
              {selectListHandler(isCreator, !!authenticated).map(
                ({ value, label }) => (
                  <label
                    className="
                      mb-[23px]
                      block
                      flex
                      justify-between
                      text-left
                      text-[16px]
                      text-[#979797]"
                    key={value}
                  >
                    <div className="flex items-center">
                      <span className="mr-[6px] inline">{value}</span>
                    </div>
                    <Checkbox
                      name={label}
                      type="checkbox"
                      register={register}
                    />
                  </label>
                )
              )}
              <Button type={ButtonTypeEnum.SUBMIT} tag="button" variant="pink">
                Save
              </Button>
            </div>
          )}
        </form>
        <Button onClick={onDeleteHandler} variant="link-purple">
          <span className="ml-[39px] mr-[29px]">Delete</span>
        </Button>
      </div>
    </>
  )
}

export default WalletListItem
