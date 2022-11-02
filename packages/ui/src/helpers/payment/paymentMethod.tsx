import {
  CircleCardDto,
  GetPayinMethodResponseDtoMethodEnum
} from "@passes/api-client"
import AmexCardIcon from "public/icons/amex-icon.svg"
import CardIcon from "public/icons/bank-card.svg"
import DiscoverCardIcon from "public/icons/discover-icon.svg"
import MasterCardIcon from "public/icons/mastercard-icon.svg"
import VisaIcon from "public/icons/visa-icon.svg"
import React from "react"

import { cryptoWalletsType } from "./cryptoWalletsType"

export const displayCardIcon = (cardDigit: string, size: number) => {
  switch (cardDigit) {
    case "4":
      return <VisaIcon height={size} width={size} />
    case "5":
      return <MasterCardIcon height={size} width={size} />
    case "3":
      return <AmexCardIcon height={size} width={size} />
    case "6":
      return <DiscoverCardIcon height={size} width={size} />
    default:
      return <CardIcon height={size} width={size} />
  }
}
export const paymentMethodConfig = (
  payinMethod: string,
  chain?: string,
  cardInfo?: CircleCardDto
) => {
  switch (payinMethod) {
    case GetPayinMethodResponseDtoMethodEnum.None:
      return (
        <div>
          <span className="mt-[12px] block text-[16px] font-bold text-[#ffff]/90">
            Set Up Default Payment Method
          </span>
        </div>
      )
    case GetPayinMethodResponseDtoMethodEnum.CircleCard:
      return (
        <>
          <div className="my-4">
            <span className="mt-[12px] block text-[16px] font-bold text-[#ffff]/90">
              Pay with Card
            </span>
          </div>
          <div className="flex justify-evenly rounded border border-passes-dark-200 bg-[#100C11] p-2 text-left text-[#ffff]/90">
            <div className="flex flex-1 gap-4 justify-self-start">
              {displayCardIcon(cardInfo?.firstDigit as string, 25)}
              <span>• • • • ‏‎{cardInfo?.fourDigits}</span>
            </div>
            <div className="flex-1">
              <span>
                {cardInfo?.expMonth}/{cardInfo?.expYear}
              </span>
            </div>
          </div>
        </>
      )
    default:
      return (
        <>
          <div className="my-4">
            <span className="mt-[12px] block text-[16px] font-bold text-[#ffff]/90">
              Pay with Crypto
            </span>
          </div>
          <div className="flex items-center">
            {cryptoWalletsType(payinMethod, chain)}
          </div>
        </>
      )
  }
}
