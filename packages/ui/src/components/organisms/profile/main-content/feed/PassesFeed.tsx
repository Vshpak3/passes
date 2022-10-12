import {
  GetPassesRequestDto,
  GetPassesResponseDto,
  PassApi,
  PassDto,
  PassDtoTypeEnum
} from "@passes/api-client"
import { FC, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { SelectPassFilter } from "src/components/atoms/passes/SelectPassFilter"
import { PassCard } from "src/components/molecules/pass/PassCard"

interface PassesFeedProps {
  creatorId: string
}
export const PassesFeed: FC<PassesFeedProps> = ({
  creatorId
}: PassesFeedProps) => {
  const [passType, setPassType] = useState<PassDtoTypeEnum>()

  return (
    <>
      <div className="mt-[34px]">
        <SelectPassFilter setPassType={setPassType} passType={passType} />
      </div>
      <InfiniteScrollPagination<PassDto, GetPassesResponseDto>
        keyValue={`pass/creator-passes/${creatorId}`}
        fetch={async (req: GetPassesRequestDto) => {
          const api = new PassApi()
          return await api.getCreatorPasses({
            getPassesRequestDto: req
          })
        }}
        fetchProps={{ creatorId, type: passType }}
        emptyElement={<span>No Pass to show</span>}
        KeyedComponent={({ arg }: ComponentArg<PassDto>) => {
          return <PassCard pass={arg} />
        }}
        classes="mt-[25px] grid grid-cols-2 gap-[25px] pb-20 sidebar-collapse:grid-cols-3"
      />
    </>
  )
}
