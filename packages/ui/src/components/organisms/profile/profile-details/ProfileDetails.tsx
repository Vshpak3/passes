import { useRouter } from "next/router"
import { FC, useState } from "react"
import { useProfile } from "src/hooks/useProfile"

import { EditProfile } from "./EditProfile"
import {
  EditProfileAction,
  ProfileImage,
  ProfileInformationDesktop,
  ProfileInformationMobile
} from "./ProfileComponents"
import { ProfileImageModal } from "./ProfileImageModal"

export const ProfileDetails: FC = () => {
  const router = useRouter()
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)

  const { ownsProfile, profileUserId } = useProfile()

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false)
  const [profileImageOverride, setProfileImageOverride] = useState<string>()

  const onChat = async () => {
    router.push(`/messages?user=${profileUserId}`)
  }

  if (!profileUserId) {
    return <></>
  }

  return (
    <>
      {isEditProfileModalOpen && (
        <EditProfile
          setEditProfileModalOpen={setIsEditProfileModalOpen}
          setProfileImageOverride={setProfileImageOverride}
        />
      )}
      <ProfileImageModal
        profileUserId={profileUserId}
        isProfilePicModalOpen={isProfilePicModalOpen}
        setIsProfilePicModalOpen={setIsProfilePicModalOpen}
      />
      <div className="relative rounded-[20px] md:min-h-12 md:flex md:gap-[40px] md:pb-10">
        {/* Desktop */}
        <div className="relative hidden grid-cols-5 md:grid">
          <ProfileImage
            userId={profileUserId}
            onClick={() => setIsProfilePicModalOpen(true)}
            override={profileImageOverride}
          />
          {ownsProfile && (
            <EditProfileAction setEditProfile={setIsEditProfileModalOpen} />
          )}
          <div className="col-span-4 flex flex-col px-5 pt-4">
            <ProfileInformationDesktop onChat={onChat} />
          </div>
        </div>

        {/* Mobile */}
        <div className="align-center my-4 -mt-[220px] grid w-full content-center items-center justify-items-center gap-y-[16px] rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[16px] py-[13px] backdrop-blur-[100px] md:hidden">
          <ProfileImage
            userId={profileUserId}
            onClick={() => setIsProfilePicModalOpen(true)}
          />
          {ownsProfile && (
            <EditProfileAction setEditProfile={setIsEditProfileModalOpen} />
          )}
          <ProfileInformationMobile onChat={onChat} />
        </div>
      </div>
    </>
  )
}
