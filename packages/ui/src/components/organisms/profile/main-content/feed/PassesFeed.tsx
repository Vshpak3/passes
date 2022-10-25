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
import { PassCard } from "src/components/molecules/pass/PassCard"
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
      <SelectPassFilter
        onPassTypeSelect={handlePassSelect}
        passTypes={selectedPassTypes}
      />
      <div className="flex flex-row items-center gap-3">
        {PASS_DROPDOWN_OPTIONS.map((passType) => {
          if (selectedPassTypes.includes(passType.value)) {
            return (
              <div
                key={passType.value}
                className={classNames(
                  "flex flex-row items-center gap-3 space-x-6 rounded-md border border-passes-dark-200 p-2.5"
                )}
              >
                {passType.label}
                <Cross
                  className="cursor-pointer"
                  onClick={() => handleDeleteFilterItem(passType.value)}
                />
              </div>
            )
          }

          return null
        })}
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
          return <PassCard pass={arg} />
        }}
        className="grid grid-cols-2 gap-3 pb-20 sidebar-collapse:grid-cols-3"
        style={{ overflow: "visible" }}
      />
    </>
  )
}
