import { ContentDto, ListDto, MessagesApi, PassDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction } from "react"

import { ChannelHeaderMassDM } from "./ChannelHeaderMassDM"
import { InputMessageGeneral } from "./InputMessageGeneral"

interface ChannelViewMassDMProps {
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<ContentDto[]>>
  selectedPasses: PassDto[]
  setSelectedPasses: Dispatch<SetStateAction<PassDto[]>>
  selectedLists: ListDto[]
  setSelectedLists: Dispatch<SetStateAction<ListDto[]>>
  excludedLists: ListDto[]
  setExcludedLists: Dispatch<SetStateAction<ListDto[]>>
  setMassMessage: Dispatch<SetStateAction<boolean>>
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
  const clear = () => {
    setVaultContent([])
    setSelectedLists([])
    setSelectedPasses([])
    setExcludedLists([])
    setMassMessage(false)
  }
  const save = async (
    text: string,
    contentIds: string[],
    price: number,
    previewIndex: number,
    scheduledAt?: Date
  ) => {
    const messagesApi = new MessagesApi()
    const listIds = selectedLists.map((s) => s.listId)
    const passIds = selectedPasses.map((s) => s.passId)
    const excludedIds = excludedLists.map((s) => s.listId)
    await messagesApi.massSend({
      createBatchMessageRequestDto: {
        includeListIds: listIds,
        excludeListIds: excludedIds,
        passIds: passIds,
        text,
        contentIds,
        price,
        previewIndex,
        scheduledAt
      }
    })
  }
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
      <div className="flex h-full flex-1 flex-col overflow-y-scroll" />
      {/* TODO:  after submit successful batch message the massMessage Components are disabled and redirected to messages as onlufans so there is no need for chat stream */}
      <InputMessageGeneral
        vaultContent={vaultContent}
        clear={clear}
        schedulable
        save={save}
      />
    </div>
  )
}
