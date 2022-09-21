import BackArrowIcon from "public/icons/back-arrow.svg"
import React from "react"
import Wallets from "src/components/organisms/wallets/wallets"

interface WalletManagementProps {
  setSettingsNav: (value: string) => void
}

const WalletManagement = ({ setSettingsNav }: WalletManagementProps) => {
  return (
    <div>
      <div
        onClick={() => setSettingsNav("")}
        className="flex items-center justify-start gap-4"
      >
        <BackArrowIcon />
        <span className="text-[20px] font-[700]">
          Wallet Management & Settings
        </span>
      </div>
      <Wallets />
    </div>
  )
}

export default WalletManagement
