import { ListDto, PassDto } from "@passes/api-client"
import { FC, useCallback } from "react"

import { MassDmSelectionProps } from "src/components/organisms/messages/MessagesMassDMView"
import { PassesSearchBar } from "src/components/organisms/profile/main-content/new-post/PassesSearchBar"
import { ListsSearchBar } from "./ListsSearchBar"

type GroupSelectionDMProps = MassDmSelectionProps

export const GroupSelectionDM: FC<GroupSelectionDMProps> = ({
  includedPasses,
  setIncludedPasses,
  excludedPasses,
  setExcludedPasses,
  includedLists,
  setIncludedLists,
  excludedLists,
  setExcludedLists
}) => {
  const onIncludePassSelect = useCallback(
    (pass: PassDto) => {
      setIncludedPasses((state) => [...state, pass])
    },
    [setIncludedPasses]
  )
  const onIncludeListSelect = useCallback(
    (list: ListDto) => {
      setIncludedLists((state) => [...state, list])
    },

    [setIncludedLists]
  )
  const onExcludeListSelect = useCallback(
    (list: ListDto) => {
      setExcludedLists((state) => [...state, list])
    },
    [setExcludedLists]
  )
  const onExcludePassSelect = useCallback(
    (pass: PassDto) => {
      setExcludedPasses((state) => [...state, pass])
    },
    [setExcludedPasses]
  )

  return (
    <div className="col-span-9 overflow-y-hidden border-r border-passes-gray p-4 backdrop-blur-[50px] lg:col-span-3">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-7 border-b border-passes-gray pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Include Lists
          </span>
          <ListsSearchBar
            onSelect={onIncludeListSelect}
            selectedListIds={includedLists.map((list) => list.listId)}
          />
        </div>
        <div className="flex flex-col gap-7 border-b border-passes-gray pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Include Memberships
          </span>
          <PassesSearchBar
            onSelect={onIncludePassSelect}
            selectedPassIds={includedPasses.map((pass) => pass.passId)}
          />
        </div>
        <div className="flex flex-col gap-7 border-b border-passes-gray pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Exclude Lists
          </span>
          <ListsSearchBar
            onSelect={onExcludeListSelect}
            selectedListIds={excludedLists.map((list) => list.listId)}
          />
        </div>
        <div className="flex flex-col gap-7 border-b border-passes-gray pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Exclude Memberships
          </span>
          <PassesSearchBar
            onSelect={onExcludePassSelect}
            selectedPassIds={excludedPasses.map((pass) => pass.passId)}
          />
        </div>
      </div>
    </div>
  )
}
