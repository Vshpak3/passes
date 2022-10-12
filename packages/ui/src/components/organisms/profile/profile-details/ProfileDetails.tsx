import { useRouter } from "next/router"
import { FC, useState } from "react"
import { Modal } from "src/components/organisms/Modal"
import { ContentService } from "src/helpers/content"
import { useProfile } from "src/hooks/useProfile"

import { EditProfile } from "./EditProfile"
import {
  EditProfileAction,
  ProfileImage,
  ProfileInformationDesktop,
  ProfileInformationMobile
} from "./ProfileComponents"

export const ProfileDetails: FC = () => {
  const router = useRouter()
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)

  const { editProfile, ownsProfile, onEditProfile, profileUserId } =
    useProfile()

  const onChat = async () => {
    router.push("/messages")
  }

  if (!profileUserId) {
    return <></>
  }

  return (
    <>
      {editProfile && <EditProfile />}
      <Modal
        isOpen={isProfilePicModalOpen}
        setOpen={setIsProfilePicModalOpen}
        shouldCloseOnClickOutside={true}
      >
        <div className="flex flex-row justify-center">
          <img
            src={ContentService.profileImage(profileUserId)}
            className="min-w-[500px] max-w-[500px] object-cover drop-shadow-profile-photo"
            alt=""
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src = "/img/profile/default-profile-img.svg"
            }}
          />
        </div>
      </Modal>
      <div className="rounded-[20px] md:min-h-12 md:flex md:gap-[40px] md:pb-10">
        {/* Desktop */}
        <div className="relative hidden grid-cols-5 md:grid">
          <ProfileImage
            userId={profileUserId}
            onClick={() => setIsProfilePicModalOpen(true)}
          />
          {ownsProfile && <EditProfileAction onEditProfile={onEditProfile} />}
          <div className="col-span-4 flex flex-col px-5 pt-4">
            <ProfileInformationDesktop onChat={onChat} />
          </div>
        </div>

        {/* Mobile */}
        <div className="align-center my-4 -mt-[220px] flex grid w-full content-center items-center justify-items-center gap-y-[16px] rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[16px] py-[13px] backdrop-blur-[100px] md:hidden">
          <ProfileImage
            userId={profileUserId}
            onClick={() => setIsProfilePicModalOpen(true)}
          />
          {ownsProfile && <EditProfileAction onEditProfile={onEditProfile} />}
          <ProfileInformationMobile onChat={onChat} />
        </div>
      </div>
    </>
  )
}
