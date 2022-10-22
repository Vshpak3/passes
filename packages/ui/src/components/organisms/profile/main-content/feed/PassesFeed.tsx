import {
  GetPassesRequestDto,
  GetPassesResponseDto,
  PassApi,
  PassDto,
  PassDtoTypeEnum
} from "@passes/api-client"
import classNames from "classnames"
import _ from "lodash"
import { FC, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { SelectPassFilter } from "src/components/atoms/passes/SelectPassFilter"
import { ProfilePassCard } from "src/components/molecules/pass/ProfilePassCard"
import { Cross } from "src/icons/CrossIcon"

interface PassesFeedProps {
  creatorId: string
}

const PASS_DROPDOWN_OPTIONS = [
  {
    value: PassDtoTypeEnum.External,
    label: "Whitelisted Communities"
  },
  {
    value: PassDtoTypeEnum.Lifetime,
    label: "Lifetime Passes"
  },
  {
    value: PassDtoTypeEnum.Subscription,
    label: "Subscription Passes"
  }
]
export const PassesFeed: FC<PassesFeedProps> = ({ creatorId }) => {
  const [selectedPassTypes, setSelectedPassTypes] = useState<Array<any>>([])

  const handlePassSelect = (newValues: Array<PassDtoTypeEnum>) => {
    setSelectedPassTypes([...newValues])
  }

  const handleDeleteFilterItem = (value: PassDtoTypeEnum) => {
    const temp = _.clone(selectedPassTypes)
    _.remove(temp, (item) => item === value)
    setSelectedPassTypes([...temp])
  }

  return (
    <>
      <div className="absolute flex flex-row items-center gap-[12px]">
        <SelectPassFilter
          onPassTypeSelect={handlePassSelect}
          passTypes={selectedPassTypes}
        />
        {PASS_DROPDOWN_OPTIONS.map((passType) => (
          <div
            key={passType.value}
            className={classNames(
              "hidden flex-row items-center gap-[10px] space-x-6 rounded-[6px] border border-passes-dark-200 p-2.5",
              { "!flex": selectedPassTypes.includes(passType.value) }
            )}
          >
            {passType.label}{" "}
            <Cross onClick={() => handleDeleteFilterItem(passType.value)} />
          </div>
        ))}
      </div>
      <InfiniteScrollPagination<PassDto, GetPassesResponseDto>
        keyValue={`pass/creator-passes/${creatorId}`}
        fetch={async (req: GetPassesRequestDto) => {
          const api = new PassApi()
          return await api.getCreatorPasses({
            getPassesRequestDto: req
          })
        }}
        fetchProps={{ creatorId }}
        emptyElement={<span>No Pass to show</span>}
        KeyedComponent={({ arg }: ComponentArg<PassDto>) => {
          return <ProfilePassCard pass={arg} />
        }}
        classes="mt-[100px] grid grid-cols-2 gap-[25px] pb-20 sidebar-collapse:grid-cols-3"
      />
    </>
  )
}
