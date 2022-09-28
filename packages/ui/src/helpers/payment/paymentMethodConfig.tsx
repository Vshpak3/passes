import {
  GetCircleCardResponseDto,
  GetPayinMethodResponseDtoMethodEnum
} from "@passes/api-client"
import React from "react"
import { creditCardIcons } from "src/helpers/creditCardIcon"

import { cryptoWalletsType } from "./cryptoWalletsType"

export const paymentMethodConfig = (
  payinMethod: string,
  cardInfo: GetCircleCardResponseDto | null
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
              {creditCardIcons["mastercard"]}
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
            {cryptoWalletsType(payinMethod)}
          </div>
        </>
      )
  }
}
