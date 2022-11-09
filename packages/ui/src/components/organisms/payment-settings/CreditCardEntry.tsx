import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { CircleCardDto } from "@passes/api-client"
import { PropsWithChildren } from "react"

import { displayCardIcon } from "src/helpers/payment/paymentMethod"

interface CreditCardEntryProps {
  card: CircleCardDto
  showName: boolean
}

export const CreditCardEntry = ({
  card,
  showName,
  children
}: PropsWithChildren<CreditCardEntryProps>) => {
  return (
    <div className="flex-1 items-center">
      <div className="flex flex-row justify-between">
        {showName && (
          <span className="text-[15px] font-[700]">{card.name}</span>
        )}
        {children}
      </div>
      <div className="mt-4 flex flex-row">
        {displayCardIcon(card.firstDigit, 35, 35)}
        <span className="mx-6 text-[14px] font-[500]">
          **** **** **** {card.fourDigits}
        </span>
        <div className="mr-1 flex flex-row justify-between">
          <div className="flex">
            <div className="flex flex-col">
              <span className="-mb-1 w-8 text-[10px] font-[500] opacity-70">
                VALID
              </span>
              <span className="w-8 text-[10px] font-[500] opacity-70">
                THRU
              </span>
            </div>
            <span className="ml-2 text-[14px] font-[500]">
              {card.expMonth}/{card.expYear.toString().slice(-2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
