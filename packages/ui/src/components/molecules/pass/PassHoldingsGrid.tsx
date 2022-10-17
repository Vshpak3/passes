import {
  GetPassHoldingsRequestDto,
  GetPassHoldingsResponseDto,
  PassApi,
  PassDtoTypeEnum,
  PassHolderDto
} from "@passes/api-client"
import React, { FC, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { SelectPassHolderTab } from "src/components/atoms/passes/SelectPassHolderTab"

import { PassHoldingTile } from "./PassHoldingTile"

export const PassHoldingsGrid: FC = () => {
  const [passType, setPassType] = useState<PassDtoTypeEnum>(
    PassDtoTypeEnum.Subscription
  )
  const [expired, setExpired] = useState<boolean | undefined>(false)
  return (
    <div className="w-full px-2 md:mt-6">
      <div className="md:align-items ml-1 mt-6 mb-2 items-center justify-between md:ml-0 md:mb-2 md:flex">
        <div className="w-fit">
          <SelectPassHolderTab
            setPassType={setPassType}
            passType={passType}
            setExpired={setExpired}
            expired={expired}
          />
          <span className="mt-[24px] block min-w-[190px] text-[24px] font-bold text-[#ffff]/90 md:mr-4">
            {passType === PassDtoTypeEnum.Subscription &&
              !expired &&
              "Active subscriptions"}
            {passType === PassDtoTypeEnum.Subscription &&
              expired &&
              "Expired subscriptions"}
            {passType === PassDtoTypeEnum.Lifetime && "Lifetime"}
          </span>
        </div>
        <hr className="md:display my-auto hidden grow border-passes-dark-200" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 sidebar-collapse:grid-cols-4">
        <InfiniteScrollPagination<PassHolderDto, GetPassHoldingsResponseDto>
          keyValue="/passholdings"
          fetch={(req: GetPassHoldingsRequestDto) => {
            const api = new PassApi()
            return api.getPassHoldings({ getPassHoldingsRequestDto: req })
          }}
          fetchProps={{
            passType,
            expired,
            order: "desc"
          }}
          KeyedComponent={({ arg }: ComponentArg<PassHolderDto>) => {
            return <PassHoldingTile passHolder={arg} />
          }}
        />
      </div>
    </div>
  )
}
