import {
  ContentBareDto,
  CreateBatchMessageRequestDto,
  ListDto,
  MessagesApi,
  PassDto
} from "@passes/api-client"
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo
} from "react"

import { InputMessageFormProps } from "src/components/molecules/messages/InputMessage"
import { MessagesMassDMViewProps } from "src/components/organisms/messages/MessagesMassDMView"
import { ChannelHeaderMassDM } from "./ChannelHeaderMassDM"
import { InputMessageTool } from "./InputMessageTool"

interface MassDMMessageProps extends MessagesMassDMViewProps {
  selectedPasses: PassDto[]
  setSelectedPasses: Dispatch<SetStateAction<PassDto[]>>
  selectedLists: ListDto[]
  setSelectedLists: Dispatch<SetStateAction<ListDto[]>>
  excludedLists: ListDto[]
  setExcludedLists: Dispatch<SetStateAction<ListDto[]>>
  initialData: Partial<InputMessageFormProps>
  schedulable?: boolean
}

export type MassMessageSaveFunction = (
  batchMessage: CreateBatchMessageRequestDto,
  contents: ContentBareDto[],
  passes: PassDto[],
  lists: ListDto[]
) => Promise<void> | void

export const MassDMMessage: FC<MassDMMessageProps> = ({
  vaultContent,
  setVaultContent,
  selectedPasses,
  setSelectedPasses,
  selectedLists,
  setSelectedLists,
  excludedLists,
  setExcludedLists,
  setMassMessage,
  initialData,
  save: initSave,
  schedulable = true
}) => {
  const clear = () => {
    setVaultContent([])
    setSelectedLists([])
    setSelectedPasses([])
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
      const includeListIds = selectedLists.map((s) => s.listId)
      const passIds = selectedPasses.map((s) => s.passId)
      const excludeListIds = excludedLists.map((s) => s.listId)
      await massMessageSave(
        {
          text,
          contentIds,
          price,
          previewIndex,
          includeListIds,
          excludeListIds,
          passIds,
          scheduledAt
        },
        content,
        selectedPasses,
        [...selectedLists, ...excludedLists]
      )
    },
    [excludedLists, massMessageSave, selectedLists, selectedPasses]
  )
  return (
    <div className="col-span-9 flex max-h-[90vh] flex-1 flex-col lg:col-span-6">
      <ChannelHeaderMassDM
        excludedLists={excludedLists}
        selectedLists={selectedLists}
        selectedPasses={selectedPasses}
        setExcludedLists={setExcludedLists}
        setSelectedLists={setSelectedLists}
        setSelectedPasses={setSelectedPasses}
      />
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
