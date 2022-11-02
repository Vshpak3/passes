import {
  GetPassHoldingsRequestDto,
  GetPassHoldingsResponseDto,
  PassApi,
  PassDtoTypeEnum,
  PassHolderDto
} from "@passes/api-client"
import { FC, useState } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { SelectPassHolderTab } from "src/components/atoms/passes/SelectPassHolderTab"
import { PassHoldingCard } from "./PassHoldingCard"

export const PassHoldings: FC = () => {
  const [passType, setPassType] = useState<PassDtoTypeEnum>(
    PassDtoTypeEnum.Subscription
  )
  const [expired, setExpired] = useState<boolean | undefined>(false)

  return (
    <div className="w-9/12 px-2">
      <div className="md:align-items ml-1 mt-6 mb-2 items-center justify-between md:ml-0 md:mb-2 md:flex">
        <div className="w-fit">
          <SelectPassHolderTab
            expired={expired}
            passType={passType}
            setExpired={setExpired}
            setPassType={setPassType}
          />
        </div>
        <hr className="md:display my-auto hidden grow border-passes-dark-200" />
      </div>

      <InfiniteScrollPagination<PassHolderDto, GetPassHoldingsResponseDto>
        KeyedComponent={({ arg }: ComponentArg<PassHolderDto>) => {
          return <PassHoldingCard passHolder={arg} />
        }}
        className="gap-3 md:flex md:flex-wrap"
        fetch={(req: GetPassHoldingsRequestDto) => {
          const api = new PassApi()
          return api.getPassHoldings({ getPassHoldingsRequestDto: req })
        }}
        fetchProps={{
          passType,
          expired,
          order: "desc"
        }}
        keyValue="/passholdings"
        options={{ revalidateOnMount: true }}
      />
    </div>
  )
}
