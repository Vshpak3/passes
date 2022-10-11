import { ChannelMemberDto } from "@passes/api-client/models"
import PhotosIcon from "public/icons/profile-photos1-icon.svg"
import React, { Dispatch, SetStateAction } from "react"
import { MessagesChannelGalleryHeader } from "src/components/molecules/direct-messages/messages-channel-gallery-header"
import { formatCurrency } from "src/helpers/formatters"

import { Avatar } from "./Avatar"

interface Props {
  selectedChannel: ChannelMemberDto
  gallery: boolean
  setGallery: Dispatch<SetStateAction<any>>
  activeContent: string
  setActiveContent: Dispatch<SetStateAction<any>>
  isCreator: boolean
}

export const ChannelHeader = ({
  gallery,
  setGallery,
  activeContent,
  setActiveContent,
  selectedChannel,
  isCreator
}: Props) => {
  return (
    <div className="flex flex-col items-start bg-[#1b141d]/50 backdrop-blur-[50px]">
      <div className="flex flex-row items-center px-5 py-4">
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
                className="flex h-full cursor-pointer items-center gap-1 pl-1 pr-2 opacity-80 hover:opacity-100 "
              >
                <PhotosIcon className="flex flex-shrink-0" />
                <span className="text-sm text-passes-secondary-color">
                  Gallery
                </span>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex h-[31px] w-fit items-center justify-center gap-3 rounded-[30px] bg-passes-secondary-color px-2">
                  <span className="cursor-pointer text-[16px] font-medium leading-[16px] text-[#FFF]">
                    Vip Pass
                    {/* TODO: replace with real passes */}
                  </span>
                </div>
                <div className="via-neutral-100 flex h-[31px] w-fit items-center justify-center gap-3 rounded-[30px] bg-gradient-to-r from-cyan-400 to-amber-500 px-2">
                  <span className="cursor-pointer text-[16px] font-medium leading-[16px] text-[#FFF]">
                    Limited Pass
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {isCreator && (
        <div className="flex min-h-[54px] w-full items-center justify-start gap-[18px] border-y border-[#fff]/10 pt-[7px] pb-[11px]">
          <div className="flex items-center justify-start gap-[10px] pl-5">
            <div className="m-0 flex cursor-pointer items-center p-0">
              <span className="flex h-[36px] w-fit items-center justify-center rounded-l-[40px] bg-[#E58230] px-2 text-[16px] font-medium leading-[16px] text-[#ffff]">
                Total Tips 👑
              </span>
              <span className="flex h-[36px] w-fit items-center justify-center rounded-r-[40px] bg-[#D55C26] px-2 text-[16px] font-medium leading-[16px] text-[#ffff] ">
                {selectedChannel.tipRecieved > 0
                  ? formatCurrency(selectedChannel.tipRecieved)
                  : "$0.00"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
