import ChevronRightIcon from "public/icons/chevron-right-icon.svg"
import PaymentCardIcon from "public/icons/payment-card.svg"
import WalletIcon from "public/icons/wallet.svg"
import React from "react"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"

import Tab from "../../Tab"

const subTabs = [
  {
    name: "Payments Settings",
    subText: "Add and manage payment methods.",
    id: SubTabsEnum.PaymentSettings,
    Icon: PaymentCardIcon
  },
  {
    name: "Wallet Management & Settings",
    subText: "Connect and manage wallets and wallet addresses.",
    id: SubTabsEnum.WalletManagementSettings,
    Icon: WalletIcon
  }
]

const PaymentWalletSettings = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext
  return (
    <Tab
      title="Payment & Wallet Settings"
      description="Manage wallets and payment methods."
    >
      <ul className="mt-[34px]">
        {subTabs.map(({ Icon, id, name, subText }) => (
          <li key={id}>
            <button
              onClick={() => addTabToStackHandler(id)}
              className="flex w-full items-center space-x-6 p-2.5 text-left hover:bg-passes-primary-color/25"
            >
              <Icon />
              <div className="flex-1">
                <h4 className="text-label">{name}</h4>
                <span className="text-base font-medium text-white/50">
                  {subText}
                </span>
              </div>
              <ChevronRightIcon />
            </button>
          </li>
        ))}
      </ul>
    </Tab>
  )
}

export default PaymentWalletSettings
