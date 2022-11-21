import { CreateWelcomeMessageRequestDto } from "@passes/api-client"
import classNames from "classnames"
import { memo, useCallback } from "react"
import { toast } from "react-toastify"

import { InputMessageTool } from "src/components/molecules/messages/mass-dm/InputMessageTool"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { useWelcomeMessage } from "src/hooks/settings/useWelcomeMessage"
import { ContentFilesFromBare } from "src/hooks/useMedia"

const WelcomeMessage = () => {
  const { addOrPopStackHandler } = useSettings() as SettingsContextProps

  const { createWelcomeMessage, isLoading, welcomeMessage } =
    useWelcomeMessage()

  const saveWelcomeMessageHandler = useCallback(
    async (welcomeMessageData: CreateWelcomeMessageRequestDto) => {
      await createWelcomeMessage(welcomeMessageData)
      addOrPopStackHandler(SubTabsEnum.ChatSettings)
      toast.success("Successfully added welcome message")
    },
    [createWelcomeMessage, addOrPopStackHandler]
  )

  const fetch = useCallback(
    (text: string, contentIds: string[], price: number, previewIndex: number) =>
      saveWelcomeMessageHandler({
        text,
        contentIds,
        price,
        previewIndex
      }),
    [saveWelcomeMessageHandler]
  )

  return (
    <>
      <Tab
        defaultSubTab={SubTabsEnum.ChatSettings}
        title="Edit Welcome Message"
      />
      <div className={classNames(isLoading && "hidden")}>
        <InputMessageTool
          clear={() => null}
          customButtonText="Save message"
          initialData={{
            text: welcomeMessage?.text,
            files: ContentFilesFromBare(welcomeMessage?.bareContents),
            isPaid: !!welcomeMessage?.price,
            price: welcomeMessage?.price.toFixed(0),
            previewIndex: welcomeMessage?.previewIndex ?? 0
          }}
          save={fetch}
          schedulable={false}
          vaultContent={[]}
        />
      </div>
    </>
  )
}

export default memo(WelcomeMessage) // eslint-disable-line import/no-default-export
