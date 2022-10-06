import { XCircle } from "lucide-react"
import { FC } from "react"
import { formatCurrency } from "src/helpers"

interface MessagePriceAlertProps {
  price: number
  onRemovePrice: () => void
}

export const MessagePriceAlert: FC<MessagePriceAlertProps> = ({
  price,
  onRemovePrice
}) => {
  return (
    <div
      className="flex h-10 items-center justify-between gap-1 rounded-md p-2.5 text-sm text-white"
      style={{
        backgroundColor: "#C943A8"
      }}
    >
      <div>Message Price {formatCurrency(price)}</div>
      <div style={{ cursor: "pointer" }}>
        <div onClick={onRemovePrice}>
          <XCircle />
        </div>
      </div>
    </div>
  )
}
