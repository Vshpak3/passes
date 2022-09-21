import React from "react"
import { Button } from "src/components/atoms"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import BankIcon from "src/icons/bank-icon.svg"

import Tab from "../../../Tab"

const ManageBank = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext

  return (
    <Tab
      title="Manage Bank"
      TitleBtn={
        <Button
          icon={<BankIcon />}
          variant="purple-light"
          tag="button"
          className="!px-6 !py-2.5 font-medium"
          onClick={() => addTabToStackHandler(SubTabsEnum.AddBank)}
        >
          Add Bank
        </Button>
      }
      withBack
    >
      <div className="mt-7">
        <div className="rounded-[20px] border border-white/[0.15] bg-[rgba(27,20,29,0.5)] py-[26px] pl-[35px] pr-[30px] backdrop-blur-[50px]">
          <div className="flex justify-between">
            <div>
              <h3 className="text-label-lg">Wells Fargo</h3>
              <p className="mt-[18px] text-base font-medium">*******8920</p>
            </div>
            <div className="max-w-[241px] font-medium">
              <h5 className="text-base">
                We&apos;ll use this bank account for:
              </h5>
              <p className="mt-1.5 text-xs text-white/50">
                Transfers to this account will always be made in IDR.
              </p>
            </div>
          </div>

          <div className="mt-[22px] flex justify-between font-medium">
            <div>
              <h6 className="text-xs leading-6 text-white/50">Transfer type</h6>
              <p className="mt-1.5 text-base">Domestic</p>
            </div>
            <div>
              <h6 className="text-xs leading-6 text-white/50">Bank Country</h6>
              <p className="mt-1.5 text-base">USA</p>
            </div>
            <div className="max-w-[241px]">
              <h6 className="text-xs leading-6 text-white/50">
                We&apos;ll use this bank account for:
              </h6>
              <p className="mt-1.5 text-base">
                Transfers to this account will always be made in IDR.
              </p>
            </div>
            <div className="max-w-[241px]">
              <h6 className="text-xs leading-6 text-white/50">Set Default</h6>
              <div className="mt-[15px] flex space-x-[15px]">
                <button className="whitespace-nowrap rounded-md border border-white py-1.5 px-6 text-sm font-bold leading-6 text-white dark:text-white">
                  Bank Default
                </button>
                <Button variant="gray" className="!py-1.5 !px-6" tag="button">
                  <span className="text-sm font-bold leading-[25px]">
                    Delete
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-[20px] border border-white/[0.15] bg-[rgba(27,20,29,0.5)] py-[26px] pl-[35px] pr-[30px] backdrop-blur-[50px]">
          <div className="flex justify-between">
            <div>
              <h3 className="text-label-lg">IDR / BCA</h3>
              <p className="mt-[18px] text-base font-medium">*******8920</p>
            </div>
            <div className="max-w-[241px] font-medium">
              <h5 className="text-base">
                We&apos;ll use this bank account for:
              </h5>
              <p className="mt-1.5 text-xs text-white/50">
                Transfers to this account will always be made in IDR.
              </p>
            </div>
          </div>

          <div className="mt-[22px] flex justify-between font-medium">
            <div>
              <h6 className="text-xs leading-6 text-white/50">Transfer type</h6>
              <p className="mt-1.5 text-base">Domestic</p>
            </div>
            <div>
              <h6 className="text-xs leading-6 text-white/50">Bank Country</h6>
              <p className="mt-1.5 text-base">USA</p>
            </div>
            <div className="max-w-[241px]">
              <h6 className="text-xs leading-6 text-white/50">
                We&apos;ll use this bank account for:
              </h6>
              <p className="mt-1.5 text-base">
                Transfers to this account will always be made in IDR.
              </p>
            </div>
            <div className="max-w-[241px]">
              <h6 className="text-xs leading-6 text-white/50">Set Default</h6>
              <div className="mt-[15px] flex space-x-[15px]">
                <Button
                  variant="purple-light"
                  tag="button"
                  className="!px-6 !py-1.5 font-medium"
                >
                  <span className="leading-[25px]">Set Default</span>
                </Button>
                <Button variant="gray" className="!py-1.5 !px-6" tag="button">
                  <span className="text-sm font-bold leading-[25px]">
                    Delete
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Tab>
  )
}

export default ManageBank
