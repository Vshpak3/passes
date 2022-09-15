import DefaultIcon from "public/icons/defaultWalletTypeIcon.svg"
import InfoIcon from "public/icons/infoIcon.svg"
import Metamask from "public/icons/metamask-icon.svg"
import Phantom from "public/icons/phantom-icon.svg"
import ArrowDown from "public/icons/post-audience-chevron-icon.svg"
import React, { FocusEvent, useState } from "react"
import { FieldValues, UseFormRegister } from "react-hook-form"
import { Button } from "src/components/atoms"
import Checkbox from "src/components/atoms/Checkbox"

interface WalletsListProps {
  walletsList: Wallet[]
  closeOnOutsideClick: (event: FocusEvent<HTMLInputElement>) => void
  selectWalletHandler: (value: string) => void
  deleteWalletHandler: (value: string) => void
  selectedAddress: string | null
  register: UseFormRegister<FieldValues>
}

interface Wallet {
  walletId: string
  userId?: string
  address: string
  chain: string
  custodial: boolean
  authenticated: boolean
}

const SELECT_FAN_OPTIONS = [
  {
    value: "Payments",
    label: "payments",
    selected: false,
    tooltipInfo: (
      <span>
        Payment provider options we support:
        <br /> &#8226; Metamask - ETH, ETH USDC, AVAX USDC, POLYGON USDC <br />
        &#8226; Phantom - SOL USDC
      </span>
    ),
    isInfo: true
  },
  {
    value: "NFT Minting & Verification ",
    label: "verification",
    selected: false,
    tooltipInfo: "Can only be a Solana Wallet.",
    isInfo: true
  }
]

const SELECT_CREATOR_OPTIONS = [
  {
    value: "Payouts",
    label: "payouts",
    selected: false,
    tooltipInfo: null,
    isInfo: false
  },
  {
    value: "Payments",
    label: "payments",
    selected: false,
    tooltipInfo: "Can only be a Solana Wallet.",
    isInfo: true
  },
  {
    value: "NFT Minting & Verification ",
    label: "verification",
    selected: false,
    tooltipInfo: "Can only be a Solana Wallet.",
    isInfo: true
  }
]

const WalletsList = ({
  walletsList,
  closeOnOutsideClick,
  selectWalletHandler,
  selectedAddress,
  register,
  deleteWalletHandler
}: WalletsListProps) => {
  const [tooltipStatus, setTooltipStatus] = useState<number | null>(null)

  const walletTypeIcon = (value: string) => {
    switch (value) {
      case "eth":
        return <Metamask />
      case "sol":
        return <Phantom />
      default:
        return <DefaultIcon />
    }
  }

  const selectListHandler = (isCreator?: boolean) => {
    if (isCreator) {
      return SELECT_CREATOR_OPTIONS
    }
    return SELECT_FAN_OPTIONS
  }

  return (
    <div
      className="
        mt-[11px]
        ml-[31px]
        mr-[50px]
        place-items-center
        justify-center
        gap-[40px]
        text-center
        text-[12px]
        text-[#ffffffeb]"
    >
      {walletsList?.map(({ address, chain, walletId }) => (
        <div
          className="
            ml-[30px]
            mr-[50px]
            mb-[11px]
            flex
            items-center
            justify-between
            border-t
            border-[#2C282D]
            pr-[35px]
            pl-[20px]
            pt-[11px]"
          key={chain}
        >
          <div className="flex items-center">
            {walletTypeIcon(chain)}
            <span className="ml-[12px] text-[14px] font-bold">
              {chain === "sol" ? "Phantom" : "Metamask"}
            </span>
          </div>
          <div className='text-[#ffffffeb]" text-[14px]'>{address}</div>
          <div
            onBlurCapture={closeOnOutsideClick}
            tabIndex={0}
            className="relative"
          >
            <input
              value={"Select"}
              onClick={() => selectWalletHandler(address)}
              readOnly
              className="
                relative
                mt-5
                block
                h-[45px]
                w-[207px]
                cursor-pointer
                rounded-md
                border
                border-passes-gray-100
                bg-black
                p-[10px]
                text-[24px]
                text-base
                text-sm
                font-bold
                text-white
                outline-none
                md:mt-0
                md:ml-4"
            />
            <div className="absolute top-[50%] right-[16px] translate-y-[-50%] cursor-pointer">
              <ArrowDown onClick={() => selectWalletHandler(address)} />
            </div>
            {selectedAddress === address && (
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
                {selectListHandler().map(
                  ({ value, label, isInfo, tooltipInfo }, index) => (
                    <label
                      className="mb-[23px] block flex justify-between	text-left text-[16px] text-[#979797]"
                      key={value}
                    >
                      <div className="flex items-center">
                        {value}{" "}
                        {isInfo && (
                          <div className="relative flex items-center">
                            <button
                              onMouseEnter={() => setTooltipStatus(index)}
                              onMouseLeave={() => setTooltipStatus(null)}
                            >
                              <InfoIcon className="ml-[8px]" />
                            </button>
                            {tooltipStatus === index && (
                              <div
                                role="tooltip"
                                className="
                                  absolute
                                  bottom-[100%]
                                  left-[50%]
                                  z-20
                                  mb-[11px]
                                  w-[200px]
                                  -translate-x-[50%]
                                  rounded
                                  bg-[#2A242B]
                                  p-4
                                  px-[8px]
                                  py-[12px]
                                  text-[12px]
                                  font-medium
                                  text-white
                                  shadow-lg
                                  transition
                                  duration-150
                                  ease-in-out"
                              >
                                {tooltipInfo}
                                <span
                                  className="
                                    absolute
                                    left-[50%]
                                    bottom-[-5px]
                                    z-20
                                    before:block
                                    before:h-[12px]
                                    before:w-[12px]
                                    before:-translate-x-[50%]
                                    before:rotate-45
                                    before:bg-[#2A242B]
                                    before:content-['']"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <Checkbox
                        name={label}
                        type="checkbox"
                        register={register}
                      />
                    </label>
                  )
                )}
                <Button variant="pink">Save</Button>
              </div>
            )}
          </div>
          <Button
            onClick={() => deleteWalletHandler(walletId)}
            variant="link-purple"
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  )
}
export default WalletsList
