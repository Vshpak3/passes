import Link from "next/link"
import React from "react"

const PAYMENT_SETTINGS = [
  {
    name: "Manage Wallets",
    value: "wallets-manage",
    path: "/wallets"
  }
]

interface PaymentSettings {
  name: string
  value: string
  path: string
}

const PaymentAndWalletSettings = () => (
  <>
    <div>
      <div className="border-b border-[#2C282D] pb-5">
        <h2>Managing Wallets, Payout & Payment Methods</h2>
      </div>
      {PAYMENT_SETTINGS.map(({ value, name, path }: PaymentSettings) => (
        <Link href={path} key={value}>
          <h3 className="cursor-pointer">{name}</h3>
        </Link>
      ))}
    </div>
  </>
)

export default PaymentAndWalletSettings
