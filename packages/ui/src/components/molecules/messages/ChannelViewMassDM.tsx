import { ContentDto, ListDto, PassDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction } from "react"

import { ChannelHeaderMassDM } from "./ChannelHeaderMassDM"
import { InputMessageMassDM } from "./InputMessageMassDM"

interface ChannelViewMassDMProps {
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<any>>
  selectedPasses: PassDto[]
  setSelectedPasses: Dispatch<SetStateAction<PassDto[]>>
  selectedLists: ListDto[]
  setSelectedLists: Dispatch<SetStateAction<ListDto[]>>
  excludedLists: ListDto[]
  setExcludedLists: Dispatch<SetStateAction<ListDto[]>>
  setMassMessage: Dispatch<SetStateAction<any>>
}

export const ChannelViewMassDM: FC<ChannelViewMassDMProps> = ({
  vaultContent,
  setVaultContent,
  selectedPasses,
  setSelectedPasses,
  selectedLists,
  setSelectedLists,
  excludedLists,
  setExcludedLists,
  setMassMessage
}) => {
  return (
    <div className="flex max-h-[90vh] flex-1 flex-col">
      <ChannelHeaderMassDM
        selectedPasses={selectedPasses}
        setSelectedPasses={setSelectedPasses}
        selectedLists={selectedLists}
        setSelectedLists={setSelectedLists}
        excludedLists={excludedLists}
        setExcludedLists={setExcludedLists}
      />
      <div className="flex h-full flex-1 flex-col overflow-y-scroll"></div>
      {/* TODO:  after submit successful batch message the massMessage Components are disabled and redirected to messages as onlufans so there is no need for chat stream */}
      <InputMessageMassDM
        vaultContent={vaultContent}
        setVaultContent={setVaultContent}
        selectedPasses={selectedPasses}
        setSelectedPasses={setSelectedPasses}
        selectedLists={selectedLists}
        setSelectedLists={setSelectedLists}
        excludedLists={excludedLists}
        setExcludedLists={setExcludedLists}
        setMassMessage={setMassMessage}
      />
    </div>
  )
}
