import { PayinMethodDto } from "@passes/api-client"
import { FC } from "react"

import { MIN_THREE_DS_LIMIT } from "src/config/payments"
import { formatCurrency } from "src/helpers/formatters"

interface ThreeDSInfoProps {
  price: number
  payinMethod?: PayinMethodDto
}

export const ThreeDSInfo: FC<ThreeDSInfoProps> = ({ price, payinMethod }) => {
  return (
    <div className="">
      {!!payinMethod?.cardId && price > MIN_THREE_DS_LIMIT && (
        <span>
          A credit card purchase above {formatCurrency(MIN_THREE_DS_LIMIT)}{" "}
          requires 3DS authentication. You may be redirected shortly after
          paying to confirm the transaction.
        </span>
      )}
    </div>
  )
}
