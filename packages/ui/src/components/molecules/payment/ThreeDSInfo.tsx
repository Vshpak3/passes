import { PayinMethodDto } from "@passes/api-client"

import { MIN_THREE_DS_LIMIT } from "src/config/payments"
import { formatCurrency } from "src/helpers/formatters"

interface ThreeDSInfoProps {
  price: number
  payinMethod?: PayinMethodDto
}

export const ThreeDSInfo = ({ price, payinMethod }: ThreeDSInfoProps) => {
  return (
    <>
      {payinMethod?.cardId && price > MIN_THREE_DS_LIMIT && (
        <span>
          A credit card purchase above{" "}
          <span className="mx-1">{formatCurrency(MIN_THREE_DS_LIMIT)}</span>
          requires 3DS authentication. You may be redirected shortly after
          paying to confirm the transaction.
        </span>
      )}
    </>
  )
}
