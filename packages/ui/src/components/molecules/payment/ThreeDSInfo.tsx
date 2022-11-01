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
        <div>
          A credit card purchase above {formatCurrency(MIN_THREE_DS_LIMIT)}
          requires 3DS authentication. You may be redirected shortly after
          paying to confirm the transaction.
        </div>
      )}
    </>
  )
}
