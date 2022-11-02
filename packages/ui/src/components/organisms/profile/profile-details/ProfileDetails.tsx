import { FC, useState } from "react"

import { useProfile } from "src/hooks/profile/useProfile"
import { EditProfile } from "./EditProfile"
import { EditProfileAction } from "./EditProfileAction"
import { ProfileImage } from "./ProfileImage"
import { ProfileImageModal } from "./ProfileImageModal"
import {
  ProfileInformationDesktop,
  ProfileInformationMobile
} from "./ProfileInformation"

export const ProfileDetails: FC = () => {
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)

  const { ownsProfile, profileUserId } = useProfile()

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false)
  const [profileImageOverride, setProfileImageOverride] = useState<string>()

  const chatLink = `/messages?user=${profileUserId}`

  if (!profileUserId) {
    return null
  }

  return (
    <div className="px-4">
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
      <div className="md:min-h-12 relative rounded-[15px] md:flex md:gap-[40px] md:pb-10">
        {/* Desktop */}
        <div className="relative hidden grid-cols-5 md:grid">
          <ProfileImage
            onClick={() => setIsProfilePicModalOpen(true)}
            override={profileImageOverride}
            userId={profileUserId}
          />
          {ownsProfile && (
            <EditProfileAction setEditProfile={setIsEditProfileModalOpen} />
          )}

          <div className="col-span-4 flex flex-col px-5 pt-4">
            <ProfileInformationDesktop chatLink={chatLink} />
          </div>
        </div>

        {/* Mobile */}
        <div className="align-center my-4 -mt-[220px] grid w-full content-center items-center justify-items-center gap-y-[16px] rounded-[15px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[16px] py-[13px] backdrop-blur-[100px] md:hidden">
          <ProfileImage
            onClick={() => setIsProfilePicModalOpen(true)}
            userId={profileUserId}
          />
          {ownsProfile && (
            <EditProfileAction setEditProfile={setIsEditProfileModalOpen} />
          )}
          <ProfileInformationMobile chatLink={chatLink} />
        </div>
      </div>
    </div>
  )
}
