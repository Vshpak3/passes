import {
  ContentBareDto,
  CreateBatchMessageRequestDto,
  ListDto,
  MessagesApi,
  PassDto
} from "@passes/api-client"
import React, { FC, useCallback, useMemo } from "react"

import {
  MassDmSelectionProps,
  MessagesMassDMViewProps
} from "src/components/organisms/messages/MessagesMassDMView"
import { ChannelHeaderMassDM } from "./ChannelHeaderMassDM"
import { InputMessageTool } from "./InputMessageTool"

type MassDMMessageProps = MessagesMassDMViewProps & MassDmSelectionProps

export type MassMessageSaveFunction = (
  batchMessage: CreateBatchMessageRequestDto,
  contents: ContentBareDto[],
  passes: PassDto[],
  lists: ListDto[]
) => Promise<void> | void

export const MassDMMessage: FC<MassDMMessageProps> = ({
  vaultContent,
  setVaultContent,
  setMassMessage,
  initialData,
  save: initSave,
  schedulable = true,
  ...props
}) => {
  const {
    includedPasses,
    setIncludedPasses,
    excludedPasses,
    setExcludedPasses,
    includedLists,
    setIncludedLists,
    excludedLists,
    setExcludedLists
  } = props
  const clear = () => {
    setVaultContent([])
    setIncludedPasses([])
    setIncludedLists([])
    setExcludedPasses([])
    setExcludedLists([])
    setMassMessage(false)
  }
  const massMessageSave = useMemo(() => {
    if (initSave) {
      return initSave
    }
    return async (batchMessage: CreateBatchMessageRequestDto) => {
      const messagesApi = new MessagesApi()
      await messagesApi.massSend({
        createBatchMessageRequestDto: batchMessage
      })
    }
  }, [initSave])
  const save = useCallback(
    async (
      text: string,
      contentIds: string[],
      price: number,
      previewIndex: number,
      content: ContentBareDto[],
      scheduledAt?: Date
    ) => {
      const includeListIds = includedLists.map((s) => s.listId)
      const includePassIds = includedPasses.map((s) => s.passId)
      const excludeListIds = excludedLists.map((s) => s.listId)
      const excludePassIds = excludedPasses.map((s) => s.passId)
      await massMessageSave(
        {
          text,
          contentIds,
          price,
          previewIndex,
          includeListIds,
          excludeListIds,
          includePassIds,
          excludePassIds,
          scheduledAt
        },
        content,
        [...includedPasses, ...excludedPasses],
        [...includedLists, ...excludedLists]
      )
    },
    [
      excludedLists,
      excludedPasses,
      includedLists,
      includedPasses,
      massMessageSave
    ]
  )
  return (
    <div className="col-span-9 flex max-h-[90vh] flex-1 flex-col lg:col-span-6">
      <ChannelHeaderMassDM {...props} />
      <div className="flex h-full flex-1 flex-col overflow-y-scroll" />
      {/* TODO:  after submit successful batch message the massMessage Components are disabled and redirected to messages as onlufans so there is no need for chat stream */}
      <InputMessageTool
        clear={clear}
        initialData={initialData}
        save={save}
        schedulable={schedulable}
        vaultContent={vaultContent}
      />
    </div>
  )
}
