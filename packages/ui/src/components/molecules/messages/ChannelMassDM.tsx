import { ListDto, PassDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction, useCallback } from "react"

import { PassesSearchBar } from "src/components/organisms/profile/main-content/new-post/PassesSearchBar"
import { ListsSearchBar } from "./ListsSearchBar"

interface ChannelListsProps {
  selectedPasses: PassDto[]
  setSelectedPasses: Dispatch<SetStateAction<PassDto[]>>
  selectedLists: ListDto[]
  setSelectedLists: Dispatch<SetStateAction<ListDto[]>>
  excludedLists: ListDto[]
  setExcludedLists: Dispatch<SetStateAction<ListDto[]>>
  userId: string
}

export const ChannelMassDM: FC<ChannelListsProps> = ({
  selectedPasses,
  setSelectedPasses,
  selectedLists,
  setSelectedLists,
  excludedLists,
  setExcludedLists,
  userId
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
    <div className="min-w-[100%] overflow-y-auto border-r border-[#fff]/10 p-[30px]  backdrop-blur-[50px] md:min-w-[35%]">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-7 border-b border-[#fff]/10 pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Include Lists
          </span>
          <ListsSearchBar
            selectedListIds={selectedLists.map((list) => list.listId)}
            onSelect={onListSelect}
            userId={userId}
          />
        </div>
        <div className="flex flex-col gap-7 border-b border-[#fff]/10 pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Include Passes
          </span>
          <PassesSearchBar
            selectedPassIds={selectedPasses.map((pass) => pass.passId)}
            onSelect={onPassSelect}
            userId={userId}
          />
          {/* TODO: pass creator ID there is an issue on <PassesSearchBar and not necessary hook useProfile at least for messages */}
        </div>
        <div className="flex flex-col gap-7 border-b border-[#fff]/10 pb-6">
          <span className="text-[16px] font-medium leading-[24px]">
            Exclude Lists
          </span>
          <ListsSearchBar
            selectedListIds={excludedLists.map((list) => list.listId)}
            onSelect={onExcludeListSelect}
            userId={userId}
          />
        </div>
      </div>
    </div>
  )
}
