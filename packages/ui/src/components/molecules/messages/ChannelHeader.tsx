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
  setGallery: Dispatch<SetStateAction<boolean>>
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
  const galleryAvailable = false
  return (
    <div className="flex flex-col items-start bg-[#1b141d]/50 backdrop-blur-[50px]">
      <div className="flex w-full flex-row items-center justify-between px-5 py-4">
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
            <div className="">
              <a
                href={`${window.location.origin}/${selectedChannel.otherUserUsername}`}
              >
                <ProfileThumbnail userId={selectedChannel.otherUserId} />
              </a>
            </div>
            <div className="flex flex-col">
              <div className="text-brand-600 flex flex-col items-start gap-2 pl-3">
                <NameDisplay
                  displayName={selectedChannel.otherUserDisplayName}
                  username={selectedChannel.otherUserUsername}
                  linked={true}
                />
                {isCreator && (
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-start gap-[10px]">
                      <div className="m-0 flex cursor-pointer items-center overflow-hidden rounded-md">
                        <span className="flex w-fit items-center justify-center bg-[#B52A6F] py-1 px-3 text-sm font-normal text-[#ffff]">
                          Total Tip Amount
                        </span>
                        <span className="flex w-fit items-center justify-center bg-[#B52A6F40]/25 px-3 py-1 text-sm font-normal text-[#ffff]">
                          {selectedChannel.tipRecieved > 0
                            ? formatCurrency(selectedChannel.tipRecieved)
                            : "$0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!gallery && galleryAvailable && (
          <div
            onClick={() => setGallery(!gallery)}
            className="mr-24 flex cursor-pointer items-center gap-1 rounded-md bg-[#B52A6F40]/10 py-1 px-3 opacity-80 hover:opacity-100 "
          >
            <PhotosIcon className="flex flex-shrink-0" />
            <span className="text-sm text-[#B52A6F]">Gallery</span>
          </div>
        )}
      </div>
    </div>
  )
}
