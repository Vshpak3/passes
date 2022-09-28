import { ChannelMemberDto } from "@passes/api-client/models"
import PhotosIcon from "public/icons/profile-photos1-icon.svg"
import React, { Dispatch, SetStateAction } from "react"

import { MessagesChannelGalleryHeader } from "../direct-messages/messages-channel-gallery-header"
import { Avatar } from "./index"

interface Props {
  selectedChannel: ChannelMemberDto
  gallery: boolean
  setGallery: Dispatch<SetStateAction<any>>
  activeContent: string
  setActiveContent: Dispatch<SetStateAction<any>>
}
export const ChannelHeader = ({
  gallery,
  setGallery,
  activeContent,
  setActiveContent,
  selectedChannel
}: Props) => {
  return (
    <div className="flex flex-row items-center bg-[#1a141c] px-5 py-4">
      {gallery ? (
        <MessagesChannelGalleryHeader
          gallery={gallery}
          setGallery={setGallery}
          activeContent={activeContent}
          setActiveContent={setActiveContent}
        />
      ) : (
        <>
          <Avatar imageSrc="https://www.w3schools.com/w3images/avatar1.png" />
          <span className="text-brand-600 pl-2">
            {selectedChannel.otherUserUsername}
          </span>
          <div className="flex items-center gap-8 pl-3">
            <div
              onClick={() => setGallery(!gallery)}
              className="flex h-full cursor-pointer  items-center gap-1 pl-1 pr-2 opacity-80 hover:opacity-100 "
            >
              <PhotosIcon className="flex flex-shrink-0" />
              <span className="text-sm text-passes-secondary-color">
                Gallery
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
