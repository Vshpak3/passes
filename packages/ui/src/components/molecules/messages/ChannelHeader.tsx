import { ChannelMemberDto } from "@passes/api-client/models"
import PhotosIcon from "public/icons/profile-photos1-icon.svg"
import { Dispatch, FC, SetStateAction } from "react"

import { NameDisplay } from "src/components/atoms/content/NameDisplay"
import { MessagesChannelGalleryHeader } from "src/components/molecules/direct-messages/MessagesChannelGalleryHeader"
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"
import { formatCurrency } from "src/helpers/formatters"
import { usePassHolders } from "src/hooks/usePassHolders"
import { useUser } from "src/hooks/useUser"
import { useUserSpending } from "src/hooks/useUserSpending"
import { useWindowSize } from "src/hooks/useWindowSizeHook"
import { ArrowLeft } from "src/icons/ArrowLeft"

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

  const { passHolders } = usePassHolders(selectedChannel.otherUserId)

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
      <div className="flex w-full flex-row items-center justify-between overflow-x-hidden border-b border-passes-gray px-5 py-4">
        {gallery ? (
          <MessagesChannelGalleryHeader
            gallery={gallery}
            paid={paid}
            selectedChannel={selectedChannel}
            setGallery={setGallery}
            setPaid={setPaid}
          />
        ) : (
          <div className="flex w-full items-center">
            <div
              className="mr-4 min-w-[16px] cursor-pointer lg:hidden"
              onClick={onBack}
            >
              <ArrowLeft height="16" width="16" />
            </div>
            <div className="">
              <a
                href={`${window.location.origin}/${selectedChannel.otherUserUsername}`}
              >
                <ProfileImage
                  key={selectedChannel.otherUserId}
                  type="thumbnail"
                  userId={selectedChannel.otherUserId}
                />
              </a>
            </div>
            <div className="flex flex-col items-start gap-[3px] pl-3 ">
              <NameDisplay
                displayName={selectedChannel.otherUserDisplayName}
                isCreator={selectedChannel.otherUserIsCreator}
                linked
                username={selectedChannel.otherUserUsername}
              />
              {isCreator && (
                <div className="flex w-full items-center justify-between">
                  <div className="flex w-full items-center justify-start gap-[10px] overflow-x-auto">
                    <div className="m-0 flex cursor-pointer items-center overflow-hidden rounded-md">
                      <div className="flex w-fit items-center justify-center whitespace-nowrap bg-passes-pink-100 py-[3px] px-[9px] text-sm font-normal text-white">
                        Total Spent
                      </div>
                      <div className="flex h-full w-fit items-center justify-center bg-[#B52A6F40]/25 px-3 py-1 text-sm font-normal text-white">
                        {formatCurrency(amount ?? 0)}
                      </div>
                    </div>
                    {passHolders?.map((passHolder) => (
                      <div
                        className="m-0 flex cursor-pointer items-center overflow-hidden rounded-md"
                        key={passHolder.passHolderId}
                      >
                        <span className="flex w-fit items-center justify-center whitespace-nowrap bg-[#B52A6F40]/25 px-3 py-1 text-sm font-normal text-white">
                          {passHolder.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {!gallery && galleryAvailable && (
          <div
            className="mr-24 flex cursor-pointer items-center gap-1 rounded-md bg-[#B52A6F40]/10 py-1 px-3 opacity-80 hover:opacity-100"
            onClick={() => setGallery(!gallery)}
          >
            <PhotosIcon className="flex shrink-0" />
            <span className="text-sm text-passes-pink-100">Gallery</span>
          </div>
        )}
      </div>
    </div>
  )
}
