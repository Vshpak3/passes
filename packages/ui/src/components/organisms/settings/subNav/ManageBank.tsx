import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import BackArrowIcon from "public/icons/back-arrow.svg"
import { Dispatch, SetStateAction } from "react"

import BankIcon from "../../../../icons/bank-icon"
import { PaymentAndWalletSettingsEnum } from "./PaymentAndWalletSettings"

interface PaymentSettingsProps {
  setSettingsNav: Dispatch<SetStateAction<string>>
}

const ManageBank = ({ setSettingsNav }: PaymentSettingsProps) => {
  return (
    <>
      <div className="mb-5 flex cursor-pointer flex-row items-center justify-between border-b border-[#2C282D] pb-5">
        <div
          onClick={() => setSettingsNav(PaymentAndWalletSettingsEnum.PAYMENT)}
          className="flex items-center justify-center gap-4"
        >
          <BackArrowIcon />
          <span className="text-[20px] font-[700]">Manage Bank</span>
        </div>
        <button
          className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-passes-primary-color bg-passes-primary-color px-2 text-white"
          onClick={() => setSettingsNav(PaymentAndWalletSettingsEnum.ADD_BANK)}
        >
          <BankIcon width={25} height={25} />
          <span className="text-[16px] font-[500]">Add Bank</span>
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-5 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-7">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <span className="text-[24px] font-[700]">Wells Fargo</span>
            <span className="text-[16px] font-[500]">*******8920</span>
          </div>
          <div className="flex w-[241px] flex-col">
            <span className="text-[16px] font-[500]">
              We&apos;ll use this bank account for:
            </span>
            <span className="text-[12px] font-[500] opacity-50">
              Transfers to this account will always be made in IDR.
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-[0.2] flex-col">
            <span className="text-[12px] font-[500] opacity-50">
              Transfer type
            </span>
            <span className="text-[16px] font-[500]">Domestic</span>
          </div>
          <div className="flex flex-[0.2] flex-col">
            <span className="text-[12px] font-[500] opacity-50">
              Bank country
            </span>
            <span className="text-[16px] font-[500]">USA</span>
          </div>
          <div className="flex flex-[0.4] flex-col">
            <span className="text-[12px] font-[500] opacity-50">
              We&apos;ll use this bank account for:
            </span>
            <span className="text-[14px] font-[500]">
              Transfers to this account will always be made in IDR.
            </span>
          </div>
          <div className="flex flex-[0.4] flex-col">
            <span className="text-[12px] font-[500] opacity-50">
              Set Default
            </span>
            <div className="flex flex-row gap-2">
              <button
                className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-[6px] border border-white/70 bg-transparent px-2 text-white"
                onClick={() => console.log}
              >
                <span className="text-[16px] font-[500]">Bank Default</span>
              </button>
              <button
                className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 text-white"
                onClick={() => console.log}
              >
                <BankIcon width={25} height={25} />
                <span className="text-[16px] font-[500]">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-7">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <span className="text-[24px] font-[700]">IDR / BCA</span>
            <span className="text-[16px] font-[500]">*******8920</span>
          </div>
          <div className="flex w-[241px] flex-col">
            <span className="text-[16px] font-[500]">
              We&apos;ll use this bank account for:
            </span>
            <span className="text-[12px] font-[500] opacity-50">
              Transfers to this account will always be made in IDR.
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-[0.2] flex-col">
            <span className="text-[12px] font-[500] opacity-50">
              Transfer type
            </span>
            <span className="text-[16px] font-[500]">Domestic</span>
          </div>
          <div className="flex flex-[0.2] flex-col">
            <span className="text-[12px] font-[500] opacity-50">
              Bank country
            </span>
            <span className="text-[16px] font-[500]">USA</span>
          </div>
          <div className="flex flex-[0.4] flex-col">
            <span className="text-[12px] font-[500] opacity-50">
              We&apos;ll use this bank account for:
            </span>
            <span className="text-[14px] font-[500]">
              Transfers to this account will always be made in IDR.
            </span>
          </div>
          <div className="flex flex-[0.4] flex-col">
            <span className="text-[12px] font-[500] opacity-50">
              Set Default
            </span>
            <div className="flex flex-row gap-2">
              <button
                className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-passes-primary-color bg-passes-primary-color px-2 text-white"
                onClick={() => console.log}
              >
                <span className="text-[16px] font-[500]">Set Default</span>
              </button>
              <button
                className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 text-white"
                onClick={() => console.log}
              >
                <BankIcon width={25} height={25} />
                <span className="text-[16px] font-[500]">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageBank
