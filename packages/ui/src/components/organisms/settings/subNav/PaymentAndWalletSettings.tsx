import CardIcon from "public/icons/bank-card.svg"
import WalletIcon from "public/icons/wallet-manage.svg"
import React, { Dispatch, SetStateAction, useState } from "react"

import AddBank from "./AddBank"
import AddCard from "./AddCard"
import ManageBank from "./ManageBank"
import ManageCard from "./ManageCard"
import PaymentSettings from "./PaymentSettings"
import ViewAllTransactions from "./ViewAllTransactions"
import WalletManagement from "./WalletManagement"

interface PaymentSettingsProps {
  setSettingsNav: Dispatch<SetStateAction<string>>
}

export const PaymentAndWalletSettingsEnum = {
  PAYMENT: "payment",
  VIEW_ALL_TRANSACTIONS: "viewAllTransactions",
  MANAGE_BANK: "manageBank",
  ADD_BANK: "addBank",
  MANAGE_CARD: "manageCard",
  MANAGE_WALLETS: "manageWallets",
  ADD_CARD: "addCard"
}

const PaymentAndWalletNav = ({ setSettingsNav }: PaymentSettingsProps) => (
  <>
    <div className="mb-5 flex flex-col border-b border-[#2C282D] pb-5">
      <span className="text-[20px] font-[700]">Payment & Wallet Settings</span>
      <span className="text-[16px] font-[500] opacity-50">
        Manage wallets and payment methods.
      </span>
    </div>
    <div
      onClick={() => setSettingsNav(PaymentAndWalletSettingsEnum.PAYMENT)}
      className="mb-5 flex cursor-pointer flex-row items-center gap-4"
    >
      <CardIcon />
      <div className="flex flex-col">
        <span className="text-[16px] font-[700]">Payments Settings</span>
        <span className="text-[16px] font-[500] opacity-50">
          Add and manage payment methods.
        </span>
      </div>
    </div>
    <div
      onClick={() =>
        setSettingsNav(PaymentAndWalletSettingsEnum.MANAGE_WALLETS)
      }
      className="flex cursor-pointer flex-row items-center gap-4"
    >
      <WalletIcon />
      <div className="flex flex-col">
        <span className="text-[16px] font-[700]">
          Wallet Management & Settings
        </span>
        <span className="text-[16px] font-[500] opacity-50">
          Connect and manage wallets and wallet addresses.
        </span>
      </div>
    </div>
  </>
)

const PaymentAndWalletSettings = () => {
  const [settingNav, setSettingsNav] = useState("")

  switch (settingNav) {
    case PaymentAndWalletSettingsEnum.PAYMENT:
      return <PaymentSettings setSettingsNav={setSettingsNav} />
    case PaymentAndWalletSettingsEnum.VIEW_ALL_TRANSACTIONS:
      return <ViewAllTransactions setSettingsNav={setSettingsNav} />
    case PaymentAndWalletSettingsEnum.MANAGE_BANK:
      return <ManageBank setSettingsNav={setSettingsNav} />
    case PaymentAndWalletSettingsEnum.ADD_BANK:
      return <AddBank setSettingsNav={setSettingsNav} />
    case PaymentAndWalletSettingsEnum.MANAGE_CARD:
      return <ManageCard setSettingsNav={setSettingsNav} />
    case PaymentAndWalletSettingsEnum.MANAGE_WALLETS:
      return <WalletManagement setSettingsNav={setSettingsNav} />
    case PaymentAndWalletSettingsEnum.ADD_CARD:
      return <AddCard setSettingsNav={setSettingsNav} />
    default:
      return <PaymentAndWalletNav setSettingsNav={setSettingsNav} />
  }
}

export default PaymentAndWalletSettings
