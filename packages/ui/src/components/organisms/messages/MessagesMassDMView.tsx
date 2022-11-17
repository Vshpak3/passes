import { ListDto, PassDto } from "@passes/api-client/models"
import { FC, memo, useState } from "react"

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
  initPasses?: PassDto[]
  initLists?: ListDto[]
  initExcludedLists?: ListDto[]
  initialData?: Partial<InputMessageFormProps>
  save?: MassMessageSaveFunction
  schedulable?: boolean
}

const MessagesMassDMViewUnmemo: FC<MessagesMassDMViewProps> = ({
  vaultContent,
  setVaultContent,
  setMassMessage,
  initPasses = [],
  initLists = [],
  initExcludedLists = [],
  initialData = {},
  save,
  schedulable
}) => {
  const [selectedPasses, setSelectedPasses] = useState<PassDto[]>(initPasses)
  const [selectedLists, setSelectedLists] = useState<ListDto[]>(initLists)
  const [excludedLists, setExcludedLists] =
    useState<ListDto[]>(initExcludedLists)

  return (
    <>
      <GroupSelectionDM
        excludedLists={excludedLists}
        selectedLists={selectedLists}
        selectedPasses={selectedPasses}
        setExcludedLists={setExcludedLists}
        setSelectedLists={setSelectedLists}
        setSelectedPasses={setSelectedPasses}
      />
      <MassDMMessage
        excludedLists={excludedLists}
        initialData={initialData}
        save={save}
        schedulable={schedulable}
        selectedLists={selectedLists}
        selectedPasses={selectedPasses}
        setExcludedLists={setExcludedLists}
        setMassMessage={setMassMessage}
        setSelectedLists={setSelectedLists}
        setSelectedPasses={setSelectedPasses}
        setVaultContent={setVaultContent}
        vaultContent={vaultContent}
      />
    </>
  )
}

export const MessagesMassDMView = memo(MessagesMassDMViewUnmemo)
