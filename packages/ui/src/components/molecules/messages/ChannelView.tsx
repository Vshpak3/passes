import { MessagesApi, UserApi } from "@passes/api-client"
import { ChannelMemberDto } from "@passes/api-client/models"
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { ChannelGalleryView } from "src/components/molecules/direct-messages/messages-channel-gallery-view"

import { ChannelHeader } from "./ChannelHeader"
import { ChannelStream } from "./ChannelStream"
import { InputMessageCreatorPerspective } from "./InputMessageCreatorPerspective"
import { InputMessageFanPerspective } from "./InputMessageFanPerspective"

interface ChannelViewProps {
  selectedChannel?: ChannelMemberDto
  gallery: boolean
  setGallery: Dispatch<SetStateAction<any>>
  isCreator: boolean
  user: any
}

export const ChannelView: FC<ChannelViewProps> = ({
  selectedChannel,
  gallery,
  setGallery,
  isCreator,
  user
}) => {
  const [activeContent, setActiveContent] = useState("All")
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
            activeContent={activeContent}
            setActiveContent={setActiveContent}
            isCreator={isCreator}
          />
          {gallery ? (
            <ChannelGalleryView
              activeContent={activeContent}
              selectedChannel={selectedChannel}
              isCreator={isCreator}
            />
          ) : (
            <>
              <ChannelStream
                channelId={selectedChannel.channelId}
                freeMessages={freeMessages}
                isCreator={isCreator}
                contentAvatarDisplayName={
                  selectedChannel.userId === user.userId
                    ? user.displayName
                    : selectedChannel.otherUserDisplayName
                }
                contentAvatarUserName={
                  selectedChannel.userId === user.userId
                    ? user.username
                    : selectedChannel.otherUserUsername
                }
              />
              {isCreator ? (
                <InputMessageCreatorPerspective
                  channelId={selectedChannel.channelId}
                  user={user}
                />
              ) : selectedChannel.channelId ? (
                <InputMessageFanPerspective
                  channelId={selectedChannel.channelId}
                  minimumTip={minimumTip}
                />
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  )
}
