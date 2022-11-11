import { CreateWelcomeMessageRequestDto } from "@passes/api-client"
import { memo, useCallback } from "react"

import { InputMessageTool } from "src/components/molecules/messages/mass-dm/InputMessageTool"
import { Tab } from "src/components/pages/settings/Tab"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { useWelcomeMessage } from "src/hooks/settings/useWelcomeMessage"
import { useUser } from "src/hooks/useUser"

const WelcomeMessage = () => {
  const { user } = useUser()
  const { popTabFromStackHandler } = useSettings() as SettingsContextProps

  const { createWelcomeMessage, isLoading, welcomeMessage } =
    useWelcomeMessage()

  const saveWelcomeMessageHandler = useCallback(
    async (welcomeMessageData: CreateWelcomeMessageRequestDto) => {
      await createWelcomeMessage(welcomeMessageData)
      popTabFromStackHandler()
    },
    [createWelcomeMessage, popTabFromStackHandler]
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
      <Tab title="Edit Welcome Message" withBack />
      {!isLoading && (
        <div>
          <InputMessageTool
            clear={() => null}
            customButtonText="Save message"
            initialData={{
              text: welcomeMessage?.text,
              files: welcomeMessage?.bareContents?.map((bare) => {
                return { content: { ...bare, userId: user?.userId ?? "" } }
              }),
              isPaid: !!welcomeMessage?.price,
              price: welcomeMessage?.price.toFixed(0)
            }}
            previewIndex={welcomeMessage?.previewIndex}
            save={fetch}
            schedulable={false}
            vaultContent={[]}
          />
        </div>
      )}
    </>
  )
}

export default memo(WelcomeMessage) // eslint-disable-line import/no-default-export
