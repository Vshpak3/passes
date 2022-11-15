import { MessagesApi } from "@passes/api-client"
import { ChannelMemberDto, ContentDto } from "@passes/api-client/models"
import { Dispatch, FC, memo, SetStateAction, useEffect, useState } from "react"

import { ChannelGalleryView } from "src/components/molecules/direct-messages/ChannelGalleryView"
import { useIsCreator } from "src/hooks/useIsCreator"
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

const ChannelViewUnmemo: FC<ChannelViewProps> = ({
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
  const removeFree = () => {
    setFreeMessages((freeMessages) =>
      freeMessages ? freeMessages - 1 : freeMessages
    )
  }

  const { isCreator: otherUserIsCreator } = useIsCreator(
    selectedChannel?.otherUserId
  )

  useEffect(() => {
    if (selectedChannel?.channelId) {
      const fetch = async () => {
        if (otherUserIsCreator) {
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
  }, [selectedChannel, otherUserIsCreator])

  return (
    <div className="z-50 col-span-9 flex h-full min-h-full w-full flex-1 flex-col overflow-y-hidden lg:col-span-6">
      {selectedChannel && (
        <>
          <ChannelHeader
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
                freeMessages={freeMessages}
                minimumTip={minimumTip}
                readAt={selectedChannel?.readAt ?? undefined}
                selectedChannel={selectedChannel}
              />
              {!!selectedChannel.channelId && (
                <InputMessage
                  isCreator={isCreator}
                  minimumTip={minimumTip}
                  otherUserIsCreator={otherUserIsCreator}
                  removeFree={removeFree}
                  selectedChannel={selectedChannel}
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

export const ChannelView = memo(ChannelViewUnmemo)
