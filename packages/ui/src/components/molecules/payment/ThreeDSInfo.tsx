import { PayinMethodDto } from "@passes/api-client"
import { MIN_THREE_DS_LIMIT } from "@passes/shared-constants"
import { FC } from "react"

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
          requires 3DS authentication. A new tab will open after paying to
          confirm the transaction.
        </span>
      )}
    </div>
  )
}
