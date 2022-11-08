import Link from "next/link"
import ChatIcon from "public/icons/mail-icon.svg"
import { FC, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { FollowButton } from "src/components/molecules/FollowButton"
import { Dropdown } from "src/components/organisms/profile/drop-down/Dropdown"
import {
  DropDownBlock,
  DropDownReport
} from "src/components/organisms/profile/drop-down/DropdownOptions"
import { useProfile } from "src/hooks/profile/useProfile"
import { useUser } from "src/hooks/useUser"
import { EditProfile } from "./EditProfile"
import { EditProfileButton } from "./EditProfileButton"
import { ProfileImage } from "./ProfileImage"
import { ProfileImageModal } from "./ProfileImageModal"
import { ProfileInformation } from "./ProfileInformation"

export const ProfileDetails: FC = () => {
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)

  const { user } = useUser()
  const { ownsProfile, profileUserId, profileUsername, profile } = useProfile()

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false)
  const [profileImageOverride, setProfileImageOverride] = useState<string>()

  const chatLink = user ? `/messages?user=${profileUserId}` : "/login"

  if (!profileUserId) {
    return null
  }

  return (
    <div className="relative px-4">
      {isEditProfileModalOpen && (
        <EditProfile
          setEditProfileModalOpen={setIsEditProfileModalOpen}
          setProfileImageOverride={setProfileImageOverride}
        />
      )}
      <ProfileImageModal
        isProfilePicModalOpen={isProfilePicModalOpen}
        profileUserId={profileUserId}
        setIsProfilePicModalOpen={setIsProfilePicModalOpen}
      />

      <div className="flex pb-3 md:flex">
        {/* desktop */}
        <div className="hidden h-full w-full flex-row md:flex">
          <div className="flex h-full max-w-[138px] translate-y-[-65px] flex-col justify-center md:translate-y-[-75px] ">
            <ProfileImage
              onClick={() => setIsProfilePicModalOpen(true)}
              override={profileImageOverride}
              userId={profileUserId}
            />
            <div className="flex w-full flex-col items-center pt-5">
              {ownsProfile ? (
                <EditProfileButton setEditProfile={setIsEditProfileModalOpen} />
              ) : (
                <>
                  <FollowButton
                    className="m-auto h-[36px] w-[98px] pt-5"
                    creatorId={profileUserId}
                  />

                  {!!profile?.isCreator && (
                    <Link
                      className="m-auto h-[36px] w-[98px] pt-2"
                      href={chatLink}
                    >
                      <Button className="w-full" variant="pink-outline">
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
        </div>

        {/* mobile */}
        <div className="flex h-full w-full flex-col md:hidden">
          <div className="flex flex-row">
            <div className="flex h-full max-w-[138px] translate-y-[-65px] flex-col justify-center md:translate-y-[-75px] ">
              <ProfileImage
                onClick={() => setIsProfilePicModalOpen(true)}
                override={profileImageOverride}
                userId={profileUserId}
              />
            </div>
          </div>
          <div className="flex w-full flex-col px-5 pt-4">
            <ProfileInformation />
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="absolute top-4 right-10 flex-row items-start pr-3 md:hidden">
        {ownsProfile ? (
          <EditProfileButton setEditProfile={setIsEditProfileModalOpen} />
        ) : (
          <>
            <FollowButton
              className="h-[36px] w-[98px]"
              creatorId={profileUserId}
            />

            {!!profile?.isCreator && (
              <Link className="h-[36px] w-[98px]" href={chatLink}>
                <Button className="h-[36px] w-[98px]" variant="pink-outline">
                  <ChatIcon />
                </Button>
              </Link>
            )}
          </>
        )}
      </div>

      {!ownsProfile && (
        <div className="absolute top-4 right-5 items-center justify-between">
          <Dropdown
            items={[
              ...DropDownReport(true, {
                username: profileUsername ?? "",
                userId: profileUserId
              }),
              ...DropDownBlock(true, {
                username: profileUsername ?? "",
                userId: profileUserId
              })
            ]}
          />
        </div>
      )}
    </div>
  )
}
