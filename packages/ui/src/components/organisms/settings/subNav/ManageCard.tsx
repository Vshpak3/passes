import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import AmexCardIcon from "public/icons/amex-icon.svg"
import BackArrowIcon from "public/icons/back-arrow.svg"
import CardIcon from "public/icons/bank-card.svg"
import DeleteIcon from "public/icons/delete-outline.svg"
import DiscoverCardIcon from "public/icons/discover-icon.svg"
import MasterCardIcon from "public/icons/mastercard-icon.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import VisaIcon from "public/icons/visa-icon.svg"
import { Dispatch, SetStateAction } from "react"

import { PaymentAndWalletSettingsEnum } from "./PaymentAndWalletSettings"

interface PaymentSettingsProps {
  setSettingsNav: Dispatch<SetStateAction<string>>
}

const CARD_LIST = [
  {
    name: "Metamask Wallet",
    isWallet: true,
    isDefault: true,
    card: null
  },
  {
    name: "Anna DeGuzman",
    isWallet: false,
    isDefault: false,
    card: "mastercard"
  },
  {
    name: "Anna DeGuzman",
    isWallet: false,
    isDefault: false,
    card: "americanexpress"
  },
  {
    name: "Anna DeGuzman",
    isWallet: false,
    isDefault: false,
    card: "visa"
  },
  {
    name: "Anna DeGuzman",
    isWallet: false,
    isDefault: false,
    card: "americanexpress"
  },
  {
    name: "Anna DeGuzman",
    isWallet: false,
    isDefault: false,
    card: "discover"
  }
]

const ManageCard = ({ setSettingsNav }: PaymentSettingsProps) => {
  const displayCardIcon = (cardName: string) => {
    switch (cardName) {
      case "visa":
        return <VisaIcon width={25} height={25} />
      case "mastercard":
        return <MasterCardIcon width={25} height={25} />
      case "americanexpress":
        return <AmexCardIcon width={25} height={25} />
      case "discover":
        return <DiscoverCardIcon width={25} height={25} />
      default:
        return null
    }
  }
  return (
    <>
      <div className="mb-5 flex cursor-pointer flex-row items-center justify-between border-b border-[#2C282D] pb-5">
        <div
          onClick={() => setSettingsNav(PaymentAndWalletSettingsEnum.PAYMENT)}
          className="flex items-center justify-center gap-4"
        >
          <BackArrowIcon />
          <span className="text-[20px] font-[700]">Manage Card</span>
        </div>
        <button
          className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-passes-primary-color bg-passes-primary-color px-2 text-white"
          onClick={() => setSettingsNav(PaymentAndWalletSettingsEnum.ADD_CARD)}
        >
          <CardIcon className="mt-2" width={25} height={25} />
          <span className="text-[16px] font-[500]">Add New Payment Method</span>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {CARD_LIST.map((item, index) => (
          <div
            key={index}
            className="flex h-[227px] w-[248px] flex-col justify-between gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-4"
          >
            <span className="text-[24px] font-[700]">{item.name}</span>
            {item.isWallet ? (
              <div className="flex items-center gap-4">
                <MetamaskIcon width={50} height={50} />
                <span className="text-[12px] font-[500]">
                  Ac8ubdjd...dthjssBIPis9
                </span>
              </div>
            ) : (
              <>
                <span className="text-[12px] font-[500]">
                  **** **** **** 0222
                </span>
                <div className="mr-1 flex flex-row justify-between">
                  <div className="flex items-center">
                    <div className="flex flex-col ">
                      <span className="-mb-2 w-8 text-[10px] font-[500] opacity-70">
                        VALID
                      </span>
                      <span className="w-8 text-[10px] font-[500] opacity-70">
                        THRU
                      </span>
                    </div>
                    <span className="text-[12px] font-[500]">02/24</span>
                  </div>
                  {displayCardIcon(item?.card ?? "")}
                </div>
              </>
            )}
            <div className="flex flex-row gap-4">
              {item.isDefault ? (
                <button className="flex h-[44px] flex-1 shrink-0 items-center justify-center gap-2 rounded-full border border-passes-dark-200 bg-black px-2 text-white">
                  <span className="text-[14px] font-[700]">Default</span>
                </button>
              ) : (
                <button className="flex h-[44px] flex-1 shrink-0 items-center justify-center gap-2 rounded-full border border-passes-primary-color bg-passes-primary-color px-2 text-white">
                  <span className="text-[14px] font-[700]">Set Default</span>
                </button>
              )}
              <button className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/10">
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ManageCard
