import {
  GetCreatorStatsResponseDto,
  GetProfileResponseDto
} from "@passes/api-client"
import { MessagesApi } from "@passes/api-client/apis"
import { FC, useState } from "react"
import Modal from "src/components/organisms/Modal"
import { ContentService } from "src/helpers"
import { ProfileUpdate } from "src/helpers/updateProfile"

import { EditProfile } from "./EditProfile"
import {
  EditProfileAction,
  ProfileImage,
  ProfileInformationDesktop,
  ProfileInformationMobile
} from "./ProfileComponents"

interface ProfileDetailsProps {
  profile: GetProfileResponseDto
  ownsProfile: boolean
  username: string
  creatorStats: GetCreatorStatsResponseDto

  editProfile: boolean
  onEditProfile: () => void
  onCloseEditProfile: () => void
  onSubmitEditProfile: (values: ProfileUpdate) => Promise<void>
}

const ProfileDetails: FC<ProfileDetailsProps> = ({
  profile,
  ownsProfile,
  username,
  creatorStats,
  editProfile,
  onEditProfile,
  onCloseEditProfile,
  onSubmitEditProfile
}) => {
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false)

  const onChat = async () => {
    const api = new MessagesApi()
    await api.getOrCreateChannel({
      getChannelRequestDto: { userId: profile.userId }
    })
  }

  return (
    <>
      {editProfile && (
        <EditProfile
          profile={profile}
          onSubmitEditProfile={onSubmitEditProfile}
          onCloseEditProfile={onCloseEditProfile}
        />
      )}
      <Modal isOpen={isProfilePicModalOpen} setOpen={setIsProfilePicModalOpen}>
        <div className="">
          <img
            src={ContentService.profileImage(profile.userId)}
            className="object-cover drop-shadow-profile-photo"
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
            userId={profile.userId}
            onClick={() => setIsProfilePicModalOpen(true)}
          />
          {ownsProfile && <EditProfileAction onEditProfile={onEditProfile} />}
          <div className="col-span-4 flex flex-col px-5 pt-4">
            <ProfileInformationDesktop
              creatorId={profile.userId}
              description={profile.description}
              displayName={profile.displayName}
              likes={creatorStats?.numLikes}
              numPosts={creatorStats?.numPosts}
              onChat={onChat}
              ownsProfile={ownsProfile}
              username={username}
              discordUsername={profile.discordUsername}
              facebookUsername={profile.facebookUsername}
              instagramUsername={profile.instagramUsername}
              tiktokUsername={profile.tiktokUsername}
              twitchUsername={profile.twitchUsername}
              twitterUsername={profile.twitterUsername}
              youtubeUsername={profile.youtubeUsername}
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="align-center my-4 -mt-[220px] flex grid w-full content-center items-center justify-items-center gap-y-[16px] rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[16px] py-[13px] backdrop-blur-[100px] md:hidden">
          <ProfileImage userId={profile.userId} />
          {/* TODO: fix styling for mobile */}
          {ownsProfile && <EditProfileAction onEditProfile={onEditProfile} />}
          <ProfileInformationMobile
            creatorId={profile.userId}
            description={profile.description}
            displayName={profile.displayName}
            likes={creatorStats?.numLikes}
            numPosts={creatorStats?.numPosts}
            onChat={onChat}
            ownsProfile={ownsProfile}
            username={username}
            discordUsername={profile.discordUsername}
            facebookUsername={profile.facebookUsername}
            instagramUsername={profile.instagramUsername}
            tiktokUsername={profile.tiktokUsername}
            twitchUsername={profile.twitchUsername}
            twitterUsername={profile.twitterUsername}
            youtubeUsername={profile.youtubeUsername}
          />
        </div>
      </div>
    </>
  )
}

export default ProfileDetails
