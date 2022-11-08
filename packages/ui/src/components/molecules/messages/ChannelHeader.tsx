import { ChannelMemberDto } from "@passes/api-client/models"
import BackIcon from "public/icons/back-icon.svg"
import PhotosIcon from "public/icons/profile-photos1-icon.svg"
import React, { Dispatch, FC, SetStateAction } from "react"

import { MessagesNameDisplay } from "src/components/atoms/content/MessagesNameDisplay"
import { MessagesChannelGalleryHeader } from "src/components/molecules/direct-messages/MessagesChannelGalleryHeader"
import { ProfileThumbnail } from "src/components/organisms/profile/profile-details/ProfileThumbnail"
import { formatCurrency } from "src/helpers/formatters"
import { useUser } from "src/hooks/useUser"
import { useUserSpending } from "src/hooks/useUserSpending"
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

  const { user } = useUser()
  const { amount } = useUserSpending(
    user?.isCreator ?? false,
    selectedChannel.otherUserId
  )
  if (isTablet === undefined) {
    return null
  }

  return (
    <div className="flex h-24 flex-col items-start backdrop-blur-[50px]">
      <div className="flex w-full flex-row items-center justify-between border-b border-[#fff]/10 px-5 py-4">
        {gallery ? (
          <MessagesChannelGalleryHeader
            gallery={gallery}
            paid={paid}
            selectedChannel={selectedChannel}
            setGallery={setGallery}
            setPaid={setPaid}
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
                <ProfileThumbnail
                  key={selectedChannel.otherUserId}
                  userId={selectedChannel.otherUserId}
                />
              </a>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col items-start gap-2 pl-3">
                <MessagesNameDisplay
                  displayName={selectedChannel.otherUserDisplayName}
                  linked
                  username={selectedChannel.otherUserUsername}
                />
                {isCreator && (
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-start gap-[10px]">
                      <div className="m-0 flex cursor-pointer items-center overflow-hidden rounded-md">
                        <span className="flex w-fit items-center justify-center bg-[#B52A6F] py-1 px-3 text-sm font-normal text-[#ffff]">
                          Total Spent
                        </span>
                        <span className="flex w-fit items-center justify-center bg-[#B52A6F40]/25 px-3 py-1 text-sm font-normal text-[#ffff]">
                          {formatCurrency(amount ?? 0)}
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
            className="mr-24 flex cursor-pointer items-center gap-1 rounded-md bg-[#B52A6F40]/10 py-1 px-3 opacity-80 hover:opacity-100 "
            onClick={() => setGallery(!gallery)}
          >
            <PhotosIcon className="flex shrink-0" />
            <span className="text-sm text-[#B52A6F]">Gallery</span>
          </div>
        )}
      </div>
    </div>
  )
}
