import { ChannelMemberDto } from "@passes/api-client/models"
import React, { Dispatch, SetStateAction, useState } from "react"
import { ChannelGalleryView } from "src/components/molecules/direct-messages/messages-channel-gallery-view"

import { ChannelHeader, ChannelStream, InputMessage } from "./index"
import { InputMessageFanPerspective } from "./InputMessageFanPerspective"

interface Props {
  selectedChannel?: ChannelMemberDto
  gallery: boolean
  setGallery: Dispatch<SetStateAction<any>>
  freeMessages?: number
  isCreator: boolean
}

export const ChannelView = ({
  selectedChannel,
  gallery,
  setGallery,
  freeMessages,
  isCreator
}: Props) => {
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
          />
          {gallery ? (
            <ChannelGalleryView activeContent={activeContent} />
          ) : (
            <>
              <ChannelStream
                channelId={selectedChannel.channelId}
                freeMessages={freeMessages}
                isCreator={isCreator}
              />
              {isCreator ? (
                <InputMessage channelId={selectedChannel.channelId} />
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
