import { ChannelMemberDto } from "@passes/api-client/models"
import React, { Dispatch, FC, SetStateAction, useState } from "react"
import { ChannelGalleryView } from "src/components/molecules/direct-messages/messages-channel-gallery-view"

import { ChannelHeader } from "./ChannelHeader"
import { ChannelStream } from "./ChannelStream"
import { InputMessageCreatorPerspective } from "./InputMessageCreatorPerspective"
import { InputMessageFanPerspective } from "./InputMessageFanPerspective"

interface ChannelViewProps {
  selectedChannel?: ChannelMemberDto
  gallery: boolean
  setGallery: Dispatch<SetStateAction<any>>
  freeMessages?: number
  isCreator: boolean
  user: any
}

export const ChannelView: FC<ChannelViewProps> = ({
  selectedChannel,
  gallery,
  setGallery,
  freeMessages,
  isCreator,
  user
}) => {
  const [activeContent, setActiveContent] = useState("All")
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
              />
              {isCreator ? (
                <InputMessageCreatorPerspective
                  channelId={selectedChannel.channelId}
                  user={user}
                />
              ) : selectedChannel.channelId ? (
                <InputMessageFanPerspective
                  channelId={selectedChannel.channelId}
                />
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  )
}
