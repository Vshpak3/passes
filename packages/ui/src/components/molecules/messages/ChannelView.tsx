import React, { Dispatch, SetStateAction, useState } from "react"

import { ChannelGalleryView } from "../direct-messages/messages-channel-gallery-view"
import { ChannelHeader, ChannelStream, InputMessage } from "./index"

interface Props {
  selectedChannelId: string
  gallery: boolean
  setGallery: Dispatch<SetStateAction<any>>
}

export const ChannelView = ({
  selectedChannelId,
  gallery,
  setGallery
}: Props) => {
  const [activeContent, setActiveContent] = useState("All")
  return (
    <div className="flex max-h-[90vh] flex-1 flex-col">
      Channel id: {selectedChannelId}
      <ChannelHeader
        gallery={gallery}
        setGallery={setGallery}
        selectedChannelId={""}
        activeContent={activeContent}
        setActiveContent={setActiveContent}
      />
      {gallery ? (
        <ChannelGalleryView activeContent={activeContent} />
      ) : (
        <>
          <ChannelStream />
          <InputMessage />
        </>
      )}
    </div>
  )
}
