import { MessagesApi, UserApi } from "@passes/api-client"
import { ChannelMemberDto, ContentDto } from "@passes/api-client/models"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"

import { ChannelGalleryView } from "src/components/molecules/direct-messages/ChannelGalleryView"
import { useIsCreator } from "src/hooks/useIsCreator"
import { useOnScreen } from "src/hooks/useOnScreen"
import { ChannelHeader } from "./ChannelHeader"
import { ChannelStream } from "./ChannelStream"
import { InputMessage } from "./InputMessage"

interface ChannelViewProps {
  selectedChannel?: ChannelMemberDto
  gallery: boolean
  setGallery: Dispatch<SetStateAction<boolean>>
  isCreator: boolean
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<ContentDto[]>>
  onBack?(): void
}

export const ChannelView: FC<ChannelViewProps> = ({
  selectedChannel,
  gallery,
  setGallery,
  isCreator,
  vaultContent,
  setVaultContent,
  onBack
}) => {
  const [paid, setPaid] = useState<boolean | undefined>()
  const [freeMessages, setFreeMessages] = useState<number | null | undefined>(
    undefined
  )
  const [minimumTip, setMinimumTip] = useState<number | null | undefined>(
    undefined
  )
  const [additionalTips, setAdditionalTips] = useState<number>(0)

  const [bottomOfChatRef, isBottomOfChatVisible] = useOnScreen({
    threshold: 0.1
  })
  const removeFree = () => {
    setFreeMessages((freeMessages) =>
      freeMessages ? freeMessages - 1 : freeMessages
    )
  }
  useEffect(() => {
    setAdditionalTips(0)
    if (selectedChannel?.channelId) {
      const fetch = async () => {
        const api = new UserApi()
        const check = await api.isCreator({
          userId: selectedChannel.otherUserId
        })
        if (check.value) {
          const messagesApi = new MessagesApi()
          const freeMessagesResponse = await messagesApi.getChannelMessageInfo({
            channelId: selectedChannel.channelId ?? ""
          })
          setFreeMessages(freeMessagesResponse.messages)
          setMinimumTip(freeMessagesResponse.minimumTip)
        } else {
          setFreeMessages(undefined)
        }
      }
      fetch()
    }
  }, [selectedChannel])

  const { isCreator: otherUserIsCreator } = useIsCreator(
    selectedChannel?.otherUserId
  )
  return (
    <div
      className="z-50 col-span-7 flex h-full w-full flex-1 flex-col overflow-y-hidden
    bg-[#120C14] lg:col-span-5"
    >
      {selectedChannel && (
        <>
          <ChannelHeader
            additionalTips={additionalTips}
            gallery={gallery}
            isCreator={isCreator}
            onBack={onBack}
            paid={paid}
            selectedChannel={selectedChannel}
            setGallery={setGallery}
            setPaid={setPaid}
          />
          {gallery ? (
            <ChannelGalleryView
              isCreator={isCreator}
              paid={paid}
              selectedChannel={selectedChannel}
            />
          ) : (
            <>
              <ChannelStream
                bottomOfChatRef={bottomOfChatRef}
                channelId={selectedChannel.channelId}
                freeMessages={freeMessages}
                isBottomOfChatVisible={isBottomOfChatVisible}
                minimumTip={minimumTip}
                setAdditionalTips={setAdditionalTips}
              />
              {selectedChannel.channelId && (
                <InputMessage
                  channelId={selectedChannel.channelId}
                  isCreator={isCreator}
                  minimumTip={minimumTip}
                  otherUserIsCreator={otherUserIsCreator}
                  removeFree={removeFree}
                  setVaultContent={setVaultContent}
                  vaultContent={vaultContent}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
