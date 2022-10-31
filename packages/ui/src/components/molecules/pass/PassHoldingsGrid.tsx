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
    <div className="w-full px-2">
      <div className="md:align-items ml-1 mt-6 mb-2 items-center justify-between md:ml-0 md:mb-2 md:flex">
        <div className="w-fit">
          <SelectPassHolderTab
            setPassType={setPassType}
            passType={passType}
            setExpired={setExpired}
            expired={expired}
          />
        </div>
        <hr className="md:display my-auto hidden grow border-passes-dark-200" />
      </div>

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
        options={{ revalidateOnMount: true }}
      />
    </div>
  )
}
