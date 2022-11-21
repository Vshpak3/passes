import { ListDto, PassDto } from "@passes/api-client/models"
import { Dispatch, FC, memo, SetStateAction, useState } from "react"

import { InputMessageFormProps } from "src/components/molecules/messages/InputMessage"
import { GroupSelectionDM } from "src/components/molecules/messages/mass-dm/GroupSelectionDM"
import {
  MassDMMessage,
  MassMessageSaveFunction
} from "src/components/molecules/messages/mass-dm/MassDMMessage"
import { MessagesProps } from "./Messages"

export interface MessagesMassDMViewProps
  extends Pick<
    MessagesProps,
    "vaultContent" | "setVaultContent" | "setMassMessage"
  > {
  initIncludedPasses?: PassDto[]
  initExcludedPasses?: PassDto[]
  initIncludedLists?: ListDto[]
  initExcludedLists?: ListDto[]
  initialData?: Partial<InputMessageFormProps>
  save?: MassMessageSaveFunction
  schedulable?: boolean
}
export interface MassDmSelectionProps {
  includedPasses: PassDto[]
  setIncludedPasses: Dispatch<SetStateAction<PassDto[]>>
  excludedPasses: PassDto[]
  setExcludedPasses: Dispatch<SetStateAction<PassDto[]>>
  includedLists: ListDto[]
  setIncludedLists: Dispatch<SetStateAction<ListDto[]>>
  excludedLists: ListDto[]
  setExcludedLists: Dispatch<SetStateAction<ListDto[]>>
}

const MessagesMassDMViewUnmemo: FC<MessagesMassDMViewProps> = ({
  vaultContent,
  setVaultContent,
  setMassMessage,
  initIncludedPasses = [],
  initExcludedPasses = [],
  initIncludedLists = [],
  initExcludedLists = [],
  initialData = {},
  save,
  schedulable
}) => {
  const [includedPasses, setIncludedPasses] =
    useState<PassDto[]>(initIncludedPasses)
  const [excludedPasses, setExcludedPasses] =
    useState<PassDto[]>(initExcludedPasses)
  const [includedLists, setIncludedLists] =
    useState<ListDto[]>(initIncludedLists)
  const [excludedLists, setExcludedLists] =
    useState<ListDto[]>(initExcludedLists)

  const props = {
    includedPasses,
    setIncludedPasses,
    excludedPasses,
    setExcludedPasses,
    includedLists,
    setIncludedLists,
    excludedLists,
    setExcludedLists
  }

  return (
    <>
      <GroupSelectionDM {...props} />
      <MassDMMessage
        {...props}
        initialData={initialData}
        save={save}
        schedulable={schedulable}
        setMassMessage={setMassMessage}
        setVaultContent={setVaultContent}
        vaultContent={vaultContent}
      />
    </>
  )
}

export const MessagesMassDMView = memo(MessagesMassDMViewUnmemo)
