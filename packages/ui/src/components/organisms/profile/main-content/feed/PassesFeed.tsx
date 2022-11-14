import {
  GetPassesRequestDto,
  GetPassesResponseDto,
  PassApi,
  PassDto
} from "@passes/api-client"
import { FC, useState } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import {
  PassType,
  SelectPassFilter
} from "src/components/atoms/passes/SelectPassFilter"
import { PassCard } from "src/components/molecules/pass/PassCard"
import { usePassWebhook } from "src/hooks/webhooks/usePassWebhook"

interface PassesFeedProps {
  creatorId: string
}

export const PassesFeed: FC<PassesFeedProps> = ({ creatorId }) => {
  const [selectedPassType, setSelectedPassType] = useState<PassType>()
  usePassWebhook()
  return (
    <div className="m-5">
      <SelectPassFilter onSelectedPassType={setSelectedPassType} />
      <InfiniteScrollPagination<PassDto, GetPassesResponseDto>
        KeyedComponent={({ arg }: ComponentArg<PassDto>) => {
          return <PassCard className="w-[200px]" pass={arg} />
        }}
        childrenEnd
        className="m-auto flex flex-row flex-wrap justify-evenly gap-3 pb-20"
        emptyElement={<span>No memberships available</span>}
        fetch={async (req: GetPassesRequestDto) => {
          const api = new PassApi()
          return await api.getCreatorPasses({
            getPassesRequestDto: req
          })
        }}
        fetchProps={{ creatorId, type: selectedPassType }}
        keySelector="passId"
        keyValue={`/pages/pass/creator-passes/${creatorId}`}
        style={{ overflow: "visible" }}
      >
        <div className="w-[200px]" />
        <div className="w-[200px]" />
        <div className="w-[200px]" />
        <div className="w-[200px]" />
        <div className="w-[200px]" />
        <div className="w-[200px]" />
        <div className="w-[200px]" />
        <div className="w-[200px]" />
      </InfiniteScrollPagination>
    </div>
  )
}
