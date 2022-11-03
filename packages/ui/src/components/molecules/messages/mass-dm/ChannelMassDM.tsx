import { ListDto, PassDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback } from "react"

import { PassesSearchBar } from "src/components/organisms/profile/main-content/new-post/PassesSearchBar"
import { ListsSearchBar } from "./ListsSearchBar"

interface ChannelListsProps {
  selectedPasses: PassDto[]
  setSelectedPasses: Dispatch<SetStateAction<PassDto[]>>
  selectedLists: ListDto[]
  setSelectedLists: Dispatch<SetStateAction<ListDto[]>>
  excludedLists: ListDto[]
  setExcludedLists: Dispatch<SetStateAction<ListDto[]>>
}

export const ChannelMassDM: FC<ChannelListsProps> = ({
  selectedPasses,
  setSelectedPasses,
  selectedLists,
  setSelectedLists,
  excludedLists,
  setExcludedLists
}) => {
  const onPassSelect = useCallback(
    (pass: PassDto) => {
      setSelectedPasses((state) => [...state, pass])
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const onListSelect = useCallback(
    (list: ListDto) => {
      setSelectedLists((state) => [...state, list])
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const onExcludeListSelect = useCallback(
    (list: ListDto) => {
      setExcludedLists((state) => [...state, list])
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <div className="col-span-7 overflow-y-auto border-r border-[#fff]/10 p-10 backdrop-blur-[50px] lg:col-span-3">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-7 border-b border-[#fff]/10 pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Include Lists
          </span>
          <ListsSearchBar
            onSelect={onListSelect}
            selectedListIds={selectedLists.map((list) => list.listId)}
          />
        </div>
        <div className="flex flex-col gap-7 border-b border-[#fff]/10 pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Include Passes
          </span>
          <PassesSearchBar
            onSelect={onPassSelect}
            selectedPassIds={selectedPasses.map((pass) => pass.passId)}
          />
        </div>
        <div className="flex flex-col gap-7 border-b border-[#fff]/10 pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Exclude Lists
          </span>
          <ListsSearchBar
            onSelect={onExcludeListSelect}
            selectedListIds={excludedLists.map((list) => list.listId)}
          />
        </div>
      </div>
    </div>
  )
}
