import { MessagesApi } from "@passes/api-client/apis"
import { FC, useState } from "react"
import { Modal } from "src/components/organisms/Modal"
import { ContentService } from "src/helpers/content"
import { useCreatorProfile } from "src/hooks/useCreatorProfile"

import { EditProfile } from "./EditProfile"
import {
  EditProfileAction,
  ProfileImage,
  ProfileInformationDesktop,
  ProfileInformationMobile
} from "./ProfileComponents"

export const ProfileDetails: FC = () => {
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)

  const { editProfile, ownsProfile, profile, onEditProfile } =
    useCreatorProfile()

  const onChat = async () => {
    const api = new MessagesApi()
    await api.getOrCreateChannel({
      getChannelRequestDto: { userId: profile?.userId || "" }
    })
  }

  return (
    <>
      {editProfile && <EditProfile />}
      <Modal isOpen={isProfilePicModalOpen} setOpen={setIsProfilePicModalOpen}>
        <div className="flex flex-row justify-center">
          <img
            src={ContentService.profileImage(profile?.userId || "")}
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
            userId={profile?.userId || ""}
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
            userId={profile?.userId || ""}
            onClick={() => setIsProfilePicModalOpen(true)}
          />
          {/* TODO: fix styling for mobile */}
          {ownsProfile && <EditProfileAction onEditProfile={onEditProfile} />}
          <ProfileInformationMobile onChat={onChat} />
        </div>
      </div>
    </>
  )
}
