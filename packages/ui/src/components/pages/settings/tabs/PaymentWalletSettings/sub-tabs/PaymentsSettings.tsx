import Image from "next/image"
import ArrowDownIcon from "public/icons/arrow-down.svg"
import CalendarIcon from "public/icons/calendar.svg"
import SearchIcon from "public/icons/header-search-icon-2.svg"
import MenuIcon from "public/icons/menu.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import VisaIcon from "public/icons/visa-icon.png"
import WalletIcon from "public/icons/wallet.svg"
import WalletEditIcon from "public/icons/wallet-edit.svg"
import React, { useRef, useState } from "react"
import { Button } from "src/components/atoms"
import FilterMenu from "src/components/atoms/FilterMenu"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import { useOnClickOutside } from "src/hooks"
import BankIcon from "src/icons/bank-icon.svg"

import Tab from "../../../Tab"

const PaymentsSettings = () => {
  const [showFilterDateMenu, setShowFilterDateMenu] = useState(false)
  const { addTabToStackHandler } = useSettings() as ISettingsContext

  const filterEl = useRef(null)
  useOnClickOutside(filterEl, () => {
    setShowFilterDateMenu(false)
  })

  return (
    <>
      <Tab withBack title="Payment Settings" />
      <div className="mt-9">
        <div className="flex space-x-3">
          <div className="space-y-3 rounded-[20px] border border-white/[0.15] px-[30px] py-5">
            <p className="text-sm leading-6 text-white/[0.92]">
              Default Payout Method:
            </p>

            <div>
              <span className="text-label mr-6">Wells Fargo</span>
              <span className="text-base font-medium">USA</span>
            </div>

            <p className="text-white/70">*******8920</p>

            <Button
              icon={<BankIcon />}
              variant="purple-light"
              tag="button"
              className="!px-4 !py-2.5"
              onClick={() => addTabToStackHandler(SubTabsEnum.ManageBank)}
            >
              Manage Payout
            </Button>
          </div>

          <div className="space-y-3 rounded-[20px] border border-white/[0.15] px-[30px] py-5">
            <p className="text-sm leading-6 text-white/[0.92]">
              Default Payout Method:
            </p>

            <div>
              <span className="text-label mr-6">Anna DeGuzman</span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-white/70">*******8920</p>
              <Image src={VisaIcon} width={36} height={26} alt="VISA logo" />
            </div>

            <Button
              icon={<WalletEditIcon />}
              variant="purple-light"
              tag="button"
              className="!px-4 !py-2.5"
            >
              Manage Payment
            </Button>
          </div>

          <div className="flex flex-col justify-between rounded-[20px] border border-white/[0.15] px-[30px] py-5">
            <p className="text-sm leading-6 text-white/[0.92]">
              Default Payout Method:
            </p>

            <div className="flex items-center justify-between">
              <span className="text-label mr-6">Axy...56huad</span>
              <MetamaskIcon />
            </div>

            <Button
              icon={<WalletIcon />}
              variant="purple-light"
              tag="button"
              className="!px-4 !py-2.5"
            >
              Manage Wallet
            </Button>
          </div>
        </div>

        <div className="mt-9 rounded-xl border border-white/[0.15] px-6 pt-3 pb-4">
          <div className="text-label flex items-center justify-between">
            <h4>Payments Transaction History</h4>
            <a className="text-passes-pink-100" href="#">
              View All
            </a>
          </div>

          <div className="mt-[15px] flex items-center justify-between">
            <label className="relative">
              <input
                type="text"
                className="w-[243px] rounded-lg border-none bg-[#191919] pl-[42px]"
                placeholder="Search for Transaction"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2" />
            </label>

            <div className="relative">
              <button
                className="flex items-center space-x-2 rounded-lg bg-[#191919] py-2.5 px-4"
                onClick={() => setShowFilterDateMenu(true)}
                ref={filterEl}
              >
                <CalendarIcon />
                <span>Jan 6, 2022 – Jan 13, 2022</span>
              </button>

              {showFilterDateMenu && (
                <FilterMenu
                  onFilter={(startDate, endDate) => {
                    console.log("date", startDate, endDate)
                  }}
                  className="left-10 w-[165px] translate-y-2"
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-full overflow-auto">
          <table className="mt-[34px] w-full whitespace-nowrap lg:mt-6">
            <thead>
              <tr className="border-b-2 border-passes-dark-500 text-white/[0.92]">
                <th className="pr-4 pb-[13px] text-start text-xs font-medium leading-[18px] md:pr-2 lg:pr-1">
                  Transaction Hash
                </th>
                <th className="pr-4 pb-[13px] text-center text-xs font-medium leading-[18px] md:pr-2 lg:pr-1">
                  Payment Info
                </th>
                <th className="flex items-center justify-center space-x-1 pr-4 pb-[13px] text-center text-xs font-medium leading-[18px] md:pr-2 lg:pr-1">
                  <span>Date</span>
                  <ArrowDownIcon />
                </th>
                <th className="pr-4 pb-[13px] text-center text-xs font-medium leading-[18px] md:pr-2 lg:pr-1">
                  Amount
                </th>
                <th className="pr-4 pb-[13px] text-center text-xs font-medium leading-[18px] md:pr-2 lg:pr-1">
                  Payment Method
                </th>
                <th className="pr-4 pb-[13px] text-center text-xs font-medium leading-[18px] md:pr-2 lg:pr-1">
                  Status
                </th>
                <th className="pr-4 pb-[13px] text-center text-xs font-medium leading-[18px] md:pr-2 lg:pr-1">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="text-center text-sm text-[#B8B8B8]">
              <tr className="border-b border-passes-dark-200">
                <td className="py-[26px] pr-4 font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  ACA54769
                </td>
                <td className="md:px-auto px-4 py-[26px] md:px-2 lg:px-1">
                  Axy...56huad
                </td>
                <td className="flex items-center justify-center space-x-3 px-4 py-[26px] md:px-2 lg:px-1">
                  Jan 13, 2022
                </td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">$30,021.23</td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">Crypto</td>
                <td className="flex items-center justify-center space-x-[7px] px-4 py-[26px] text-white md:px-2 lg:px-1">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#667085]" />
                  <span>pending</span>
                </td>
                <td className="py-[26px] pr-4 text-sm font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  EtherScan
                </td>
              </tr>
              <tr className="border-b border-passes-dark-200">
                <td className="py-[26px] pr-4 font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  Visa
                </td>
                <td className="md:px-auto px-4 py-[26px] md:px-2 lg:px-1">
                  **** **** 4585
                </td>
                <td className="flex items-center justify-center space-x-3 px-4 py-[26px] md:px-2 lg:px-1">
                  Jan 13, 2022
                </td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">$30,021.23</td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">Crypto</td>
                <td className="flex items-center justify-center space-x-[7px] px-4 py-[26px] text-white md:px-2 lg:px-1">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#667085]" />
                  <span>pending</span>
                </td>
                <td className="py-[26px] pr-4 text-sm font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  <button type="button" className="mx-auto">
                    <MenuIcon />
                  </button>
                  {/* EtherScan */}
                </td>
              </tr>

              <tr className="border-b border-passes-dark-200">
                <td className="py-[26px] pr-4 font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  ACA54769
                </td>
                <td className="md:px-auto px-4 py-[26px] md:px-2 lg:px-1">
                  Axy...56huad
                </td>
                <td className="flex items-center justify-center space-x-3 px-4 py-[26px] md:px-2 lg:px-1">
                  Jan 13, 2022
                </td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">$30,021.23</td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">Crypto</td>
                <td className="flex items-center justify-center space-x-[7px] px-4 py-[26px] text-white md:px-2 lg:px-1">
                  <span>Completed</span>
                </td>
                <td className="py-[26px] pr-4 text-sm font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  EtherScan
                </td>
              </tr>
              <tr className="border-b border-passes-dark-200">
                <td className="py-[26px] pr-4 font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  Visa
                </td>
                <td className="md:px-auto px-4 py-[26px] md:px-2 lg:px-1">
                  **** **** 4585
                </td>
                <td className="flex items-center justify-center space-x-3 px-4 py-[26px] md:px-2 lg:px-1">
                  Jan 13, 2022
                </td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">$30,021.23</td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">Crypto</td>
                <td className="flex items-center justify-center space-x-[7px] px-4 py-[26px] text-white md:px-2 lg:px-1">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#667085]" />
                  <span>pending</span>
                </td>
                <td className="py-[26px] pr-4 text-sm font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  <button type="button" className="mx-auto">
                    <MenuIcon />
                  </button>
                  {/* EtherScan */}
                </td>
              </tr>

              <tr className="border-b border-passes-dark-200">
                <td className="py-[26px] pr-4 font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  ACA54769
                </td>
                <td className="md:px-auto px-4 py-[26px] md:px-2 lg:px-1">
                  Axy...56huad
                </td>
                <td className="flex items-center justify-center space-x-3 px-4 py-[26px] md:px-2 lg:px-1">
                  Jan 13, 2022
                </td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">$30,021.23</td>
                <td className="px-4 py-[26px] md:px-2 lg:px-1">Crypto</td>
                <td className="flex items-center justify-center space-x-[7px] px-4 py-[26px] text-white md:px-2 lg:px-1">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#667085]" />
                  <span>pending</span>
                </td>
                <td className="py-[26px] pr-4 text-sm font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  BlockExplorer
                </td>
              </tr>
              <tr>
                <td className="pt-[26px] pr-4 font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  ACA54769
                </td>
                <td className="md:px-auto px-4 pt-[26px] md:px-2 lg:px-1">
                  Axy...56huad
                </td>
                <td className="flex items-center justify-center space-x-3 px-4 pt-[26px] md:px-2 lg:px-1">
                  Jan 13, 2022
                </td>
                <td className="px-4 pt-[26px] md:px-2 lg:px-1">$30,021.23</td>
                <td className="px-4 pt-[26px] md:px-2 lg:px-1">Crypto</td>
                <td className="flex items-center justify-center space-x-[7px] px-4 pt-[26px] text-white md:px-2 lg:px-1">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#667085]" />
                  <span>pending</span>
                </td>
                <td className="pt-[26px] pr-4 text-sm font-bold text-passes-pink-100 md:pr-2 lg:pr-1">
                  EtherScan
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-[56px] flex items-center justify-between border-t border-white/[0.15] px-6 pt-[17px]">
          <p className="text-sm text-[#646464]">Page 1 of 10</p>
          <div className="space-x-3">
            <button className="rounded-md bg-[#322F33] px-[17px] py-[9px] text-[#FAFBFD]">
              Previous
            </button>
            <button className="rounded-md bg-[#322F33] px-[17px] py-[9px] text-[#FAFBFD]">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentsSettings
