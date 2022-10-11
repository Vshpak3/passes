import { CircleCardDto, PayinMethodDto } from "@passes/api-client"
import { useRouter } from "next/router"
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
  const router = useRouter()

  return (
    <>
      {payinMethod &&
        paymentMethodConfig(payinMethod.method, payinMethod.chain, card)}
      <div className="my-4">
        <span className="text-[#ffff]/90">
          Want to update your default payment method or add a new one?
        </span>{" "}
        <span
          className="cursor-pointer text-[#ffff]/90 underline"
          onClick={() => router.push("/settings/wallet")}
        >
          Settings
        </span>
      </div>
    </>
  )
}
