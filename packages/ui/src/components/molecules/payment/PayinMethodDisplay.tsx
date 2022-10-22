import { CircleCardDto, PayinMethodDto } from "@passes/api-client"
import Link from "next/link"
import React, { FC } from "react"
import { paymentMethodConfig } from "src/helpers/payment/paymentMethod"

interface PayinMethodDisplayProps {
  payinMethod: PayinMethodDto
  card?: CircleCardDto
}

export const PayinMethodDisplay: FC<PayinMethodDisplayProps> = ({
  payinMethod,
  card
}) => {
  return (
    <>
      {payinMethod &&
        paymentMethodConfig(payinMethod.method, payinMethod.chain, card)}
      <div className="my-4">
        <span className="text-[#ffff]/90">
          Want to update your default payment method or add a new one?
        </span>
        <Link href="/settings/wallet">Settings</Link>
      </div>
    </>
  )
}
