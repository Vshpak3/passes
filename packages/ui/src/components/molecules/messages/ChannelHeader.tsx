import { ChannelMemberDto } from "@passes/api-client/models"
import BackIcon from "public/icons/back-icon.svg"
import PhotosIcon from "public/icons/profile-photos1-icon.svg"
import React, { Dispatch, FC, SetStateAction } from "react"

import { NameDisplay } from "src/components/atoms/NameDisplay"
import { MessagesChannelGalleryHeader } from "src/components/molecules/direct-messages/MessagesChannelGalleryHeader"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { formatCurrency } from "src/helpers/formatters"
import { useWindowSize } from "src/hooks/useWindowSizeHook"

interface ChannelHeaderProps {
  selectedChannel: ChannelMemberDto
  gallery: boolean
  setGallery: Dispatch<SetStateAction<any>>
  paid?: boolean
  setPaid: Dispatch<SetStateAction<boolean | undefined>>
  isCreator: boolean
  onBack?(): void
}

export const ChannelHeader: FC<ChannelHeaderProps> = ({
  gallery,
  setGallery,
  paid,
  setPaid,
  selectedChannel,
  isCreator,
  onBack
}) => {
  const { isTablet } = useWindowSize()

  return (
    <div className="flex flex-col items-start bg-[#1b141d]/50 backdrop-blur-[50px]">
      <div className="flex w-full flex-row items-center justify-between px-5 py-4 pr-10">
        {gallery ? (
          <MessagesChannelGalleryHeader
            gallery={gallery}
            setGallery={setGallery}
            paid={paid}
            setPaid={setPaid}
            selectedChannel={selectedChannel}
          />
        ) : (
          <div className="flex items-center">
            {isTablet && (
              <div className="mr-2" onClick={onBack}>
                <BackIcon />
              </div>
            )}
            <a
              href={`${window.location.origin}/${selectedChannel.otherUserUsername}`}
            >
              <ProfileThumbnail userId={selectedChannel.otherUserId} />
            </a>
            <div className="text-brand-600 flex flex-col items-start pl-2">
              <NameDisplay
                displayName={selectedChannel.otherUserDisplayName}
                username={selectedChannel.otherUserUsername}
                linked={true}
              />
            </div>
          </div>
        )}
        {!isCreator && !gallery && (
          <div
            onClick={() => setGallery(!gallery)}
            className="flex h-full cursor-pointer items-center gap-1 rounded-[56px] bg-[#BF7AF0]/10 px-3 opacity-80 hover:opacity-100 "
          >
            <PhotosIcon className="flex flex-shrink-0" />
            <span className="text-sm text-passes-secondary-color">Gallery</span>
          </div>
        )}
      </div>
      {isCreator && (
        <div className="flex min-h-[54px] w-full items-center justify-between gap-[18px] border-y border-[#fff]/10 pt-[8px] pb-[8px] pr-12">
          <div className="flex items-center justify-start gap-[10px] pl-5">
            <div className="m-0 flex cursor-pointer items-center p-0">
              <span className="flex h-[36px] w-fit items-center justify-center rounded-l-[40px] bg-[#9C4DC1] px-2 text-[16px] font-medium leading-[16px] text-[#ffff]">
                Total Tip Amount
              </span>
              <span className="flex h-[36px] w-fit items-center justify-center rounded-r-[40px] bg-[#C943A8] px-2 text-[16px] font-medium leading-[16px] text-[#ffff]">
                {selectedChannel.tipRecieved > 0
                  ? formatCurrency(selectedChannel.tipRecieved)
                  : "$0.00"}
              </span>
            </div>
          </div>
          {!gallery && (
            <div
              onClick={() => setGallery(!gallery)}
              className="flex h-full cursor-pointer items-center gap-1 rounded-[56px] bg-[#BF7AF0]/10 px-3 opacity-80 hover:opacity-100 "
            >
              <PhotosIcon className="flex flex-shrink-0" />
              <span className="text-sm text-passes-secondary-color">
                Gallery
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
