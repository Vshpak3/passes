import Link from "next/link"
import ChatIcon from "public/icons/mail-icon.svg"
import { Dispatch, FC, SetStateAction, useContext, useState } from "react"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { FollowButton } from "src/components/molecules/FollowButton"
import { Dropdown } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownBlock,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { useUser } from "src/hooks/useUser"
import { ProfileContext } from "src/pages/[username]"
import { EditProfile } from "./EditProfile"
import { EditProfileButton } from "./EditProfileButton"
import { ProfileImage } from "./ProfileImage"
import { ProfileImageModal } from "./ProfileImageModal"
import { ProfileInformation } from "./ProfileInformation"

interface ProfileDetailsProps {
  setProfileBannerOverride: Dispatch<SetStateAction<string | undefined>>
}

export const ProfileDetails: FC<ProfileDetailsProps> = ({
  setProfileBannerOverride
}) => {
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)

  const { user } = useUser()
  const { ownsProfile, profileUserId, profileUsername, profile } =
    useContext(ProfileContext)

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false)
  const [profileImageOverride, setProfileImageOverride] = useState<string>()

  const chatLink = user ? `/messages?user=${profileUserId}` : "/login"

  const dropdownOptions = [
    ...DropDownReport(true, {
      username: profileUsername ?? "",
      userId: profileUserId ?? ""
    }),
    ...DropDownBlock(!!user?.isCreator, {
      username: profileUsername ?? "",
      userId: profileUserId ?? ""
    })
  ]

  if (!profileUserId) {
    return null
  }

  return (
    <div className="relative px-4">
      <ProfileImageModal
        isProfilePicModalOpen={isProfilePicModalOpen}
        profileUserId={profileUserId}
        setIsProfilePicModalOpen={setIsProfilePicModalOpen}
      />

      <div className="flex pb-3 md:flex">
        {/* desktop */}
        <div className="hidden h-full w-full flex-row md:flex">
          <div className="flex h-full max-w-[138px] translate-y-[-65px] flex-col justify-center md:translate-y-[-75px]">
            <ProfileImage
              onClick={() => setIsProfilePicModalOpen(true)}
              override={profileImageOverride}
              type="image"
              userId={profileUserId}
            />
            <div className="flex w-full flex-col items-center pt-5">
              {ownsProfile ? (
                <EditProfileButton setEditProfile={setIsEditProfileModalOpen} />
              ) : (
                <>
                  {!!profile?.isCreator && (
                    <FollowButton
                      className="m-auto mt-3 h-[36px] w-[98px]"
                      creatorId={profileUserId}
                    />
                  )}
                  {(!!profile?.isCreator || !!user?.isCreator) && (
                    <Link
                      className="m-auto h-[36px] w-[98px] pt-2"
                      href={chatLink}
                    >
                      <Button
                        className="w-full"
                        variant={ButtonVariant.PINK_OUTLINE}
                      >
                        <ChatIcon />
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex w-[calc(100%-138px)] flex-col px-5 pt-4">
            <ProfileInformation />
          </div>
          {!ownsProfile && (
            <div className="mt-2 flex-col">
              <Dropdown items={dropdownOptions} />
            </div>
          )}
        </div>

        {/* mobile */}
        <div className="flex w-full flex-col md:hidden">
          <div className="flex">
            <div className="absolute -top-10 ml-1 flex max-w-[138px] flex-col justify-center md:ml-0">
              <ProfileImage
                onClick={() => setIsProfilePicModalOpen(true)}
                override={profileImageOverride}
                type="image"
                userId={profileUserId}
              />
            </div>
          </div>
          <div className="flex w-full flex-col px-1">
            <ProfileInformation />
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="absolute top-2 right-2 flex-row items-start pr-3 md:hidden">
        <div className="absolute right-0 flex flex-col">
          {ownsProfile ? (
            <EditProfileButton setEditProfile={setIsEditProfileModalOpen} />
          ) : (
            <>
              {!!profile?.isCreator && (
                <FollowButton
                  className="mb-2 h-[25px] w-[80px]"
                  creatorId={profileUserId}
                />
              )}
              {(!!profile?.isCreator || !!user?.isCreator) && (
                <Link href={chatLink}>
                  <Button
                    className="h-[25px] w-[80px]"
                    variant={ButtonVariant.PINK_OUTLINE}
                  >
                    <ChatIcon />
                  </Button>
                </Link>
              )}
              {!ownsProfile && (
                <div className="mr-0 ml-auto">
                  <Dropdown items={dropdownOptions} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!!isEditProfileModalOpen && (
        <EditProfile
          setEditProfileModalOpen={setIsEditProfileModalOpen}
          setProfileBannerOverride={setProfileBannerOverride}
          setProfileImageOverride={setProfileImageOverride}
        />
      )}
    </div>
  )
}
