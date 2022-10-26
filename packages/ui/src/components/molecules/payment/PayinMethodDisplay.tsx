import { CircleCardDto, PayinMethodDto } from "@passes/api-client"
import Link from "next/link"
import React, { FC } from "react"

import { paymentMethodConfig } from "src/helpers/payment/paymentMethod"

interface PayinMethodDisplayProps {
  payinMethod: PayinMethodDto
  card?: CircleCardDto
  closeModal: () => void
}

export const PayinMethodDisplay: FC<PayinMethodDisplayProps> = ({
  payinMethod,
  card,
  closeModal
}) => {
  return (
    <>
      {payinMethod &&
        paymentMethodConfig(payinMethod.method, payinMethod.chain, card)}
      <div className="my-4">
        <span className="mr-1 text-[#ffff]/90">
          Want to update your default payment method or add a new one?
        </span>
        <Link href="/settings/payment" onClick={closeModal}>
          Set payment methods
        </Link>
      </div>
    </>
  )
}
