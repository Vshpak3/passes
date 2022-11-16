import {
  GetPassHoldingsRequestDto,
  GetPassHoldingsRequestDtoOrderEnum,
  GetPassHoldingsResponseDto,
  PassApi,
  PassDtoTypeEnum,
  PassHolderDto
} from "@passes/api-client"
import { FC, useMemo, useState } from "react"

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

  const fetchProps = useMemo(() => {
    return {
      unreadOnly: false,
      order: GetPassHoldingsRequestDtoOrderEnum.Desc
      // passType,
      // expired
    }
  }, [])

  return (
    <div className="w-full px-2">
      <div className="ml-1 mt-6 mb-2 items-center justify-between md:ml-0 md:mb-2 md:flex">
        <div className="hidden w-full overflow-x-auto">
          {/* no filtering of passes right now, makes it easier to use*/}
          <SelectPassHolderTab
            expired={expired}
            passType={passType}
            setExpired={setExpired}
            setPassType={setPassType}
          />
        </div>
        <hr className="my-auto hidden grow border-passes-dark-200" />
      </div>

      <InfiniteScrollPagination<PassHolderDto, GetPassHoldingsResponseDto>
        KeyedComponent={({ arg }: ComponentArg<PassHolderDto>) => {
          return <PassHoldingCard passHolder={arg} />
        }}
        childrenEnd
        className="m-auto flex flex-row flex-wrap items-center justify-center gap-3 md:items-start md:justify-evenly"
        fetch={(req: GetPassHoldingsRequestDto) => {
          const api = new PassApi()
          return api.getPassHoldings({ getPassHoldingsRequestDto: req })
        }}
        fetchProps={fetchProps}
        keySelector="passHolderId"
        keyValue="/pages/passholdings"
      >
        <div className="hidden w-[300px] md:block" />

        <div className="hidden w-[300px] md:block" />
        <div className="hidden w-[300px] md:block" />
        <div className="hidden w-[300px] md:block" />
      </InfiniteScrollPagination>
    </div>
  )
}
