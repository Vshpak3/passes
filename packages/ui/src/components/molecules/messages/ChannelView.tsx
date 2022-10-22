import { MessagesApi, UserApi } from "@passes/api-client"
import {
  ChannelMemberDto,
  ContentDto,
  GetUserResponseDto
} from "@passes/api-client/models"
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { ChannelGalleryView } from "src/components/molecules/direct-messages/ChannelGalleryView"

import { ChannelHeader } from "./ChannelHeader"
import { ChannelStream } from "./ChannelStream"
import { InputMessage } from "./InputMessage"

interface ChannelViewProps {
  selectedChannel?: ChannelMemberDto
  gallery: boolean
  setGallery: Dispatch<SetStateAction<any>>
  isCreator: boolean
  user: GetUserResponseDto
  vaultContent: ContentDto[]
  setVaultContent: Dispatch<SetStateAction<any>>
}

export const ChannelView: FC<ChannelViewProps> = ({
  selectedChannel,
  gallery,
  setGallery,
  isCreator,
  user,
  vaultContent,
  setVaultContent
}) => {
  const [paid, setPaid] = useState<boolean | undefined>()
  const [freeMessages, setFreeMessages] = useState<number | null | undefined>(
    undefined
  )
  const [minimumTip, setMinimumTip] = useState<number | null | undefined>(
    undefined
  )
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannel])
  return (
    <div className="flex max-h-[90vh] flex-1 flex-col">
      {selectedChannel && (
        <>
          <ChannelHeader
            gallery={gallery}
            setGallery={setGallery}
            selectedChannel={selectedChannel}
            paid={paid}
            setPaid={setPaid}
            isCreator={isCreator}
          />
          {gallery ? (
            <ChannelGalleryView
              paid={paid}
              selectedChannel={selectedChannel}
              isCreator={isCreator}
            />
          ) : (
            <>
              <ChannelStream
                channelId={selectedChannel.channelId}
                freeMessages={freeMessages}
                minimumTip={minimumTip}
                isCreator={isCreator}
                otherUserDisplayName={selectedChannel.otherUserDisplayName}
                otherUserUsername={selectedChannel.otherUserUsername}
                user={user}
              />
              {selectedChannel.channelId && (
                <InputMessage
                  channelId={selectedChannel.channelId}
                  minimumTip={minimumTip}
                  isCreator={isCreator}
                  vaultContent={vaultContent}
                  setVaultContent={setVaultContent}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
