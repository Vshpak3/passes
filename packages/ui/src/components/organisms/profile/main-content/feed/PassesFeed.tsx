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

interface PassesFeedProps {
  creatorId: string
}

export const PassesFeed: FC<PassesFeedProps> = ({ creatorId }) => {
  const [selectedPassType, setSelectedPassType] = useState<PassType>()

  return (
    <div className="mx-5 mt-5">
      <SelectPassFilter onSelectedPassType={setSelectedPassType} />
      <InfiniteScrollPagination<PassDto, GetPassesResponseDto>
        KeyedComponent={({ arg }: ComponentArg<PassDto>) => {
          return <PassCard pass={arg} />
        }}
        className="grid grid-cols-2 gap-3 pb-20 lg:grid-cols-3"
        emptyElement={<span>No memberships available</span>}
        fetch={async (req: GetPassesRequestDto) => {
          const api = new PassApi()
          return await api.getCreatorPasses({
            getPassesRequestDto: req
          })
        }}
        fetchProps={{ creatorId, type: selectedPassType }}
        keyValue={`pass/creator-passes/${creatorId}`}
        style={{ overflow: "visible" }}
      />
    </div>
  )
}
