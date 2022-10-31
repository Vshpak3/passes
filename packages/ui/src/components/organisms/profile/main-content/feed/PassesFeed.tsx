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
    <>
      <SelectPassFilter
        selectedPassType={selectedPassType}
        onSelectedPassType={setSelectedPassType}
      />
      <InfiniteScrollPagination<PassDto, GetPassesResponseDto>
        keyValue={`pass/creator-passes/${creatorId}`}
        fetch={async (req: GetPassesRequestDto) => {
          const api = new PassApi()
          return await api.getCreatorPasses({
            getPassesRequestDto: req
          })
        }}
        fetchProps={{ creatorId, type: selectedPassType }}
        emptyElement={<span>No Pass to show</span>}
        KeyedComponent={({ arg }: ComponentArg<PassDto>) => {
          return <PassCard pass={arg} />
        }}
        className="grid grid-cols-2 gap-3 pb-20 lg:grid-cols-3"
        style={{ overflow: "visible" }}
      />
    </>
  )
}
