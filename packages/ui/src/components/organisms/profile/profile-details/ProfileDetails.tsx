import {
  GetCreatorStatsResponseDto,
  GetProfileResponseDto
} from "@passes/api-client"
import { MessagesApi } from "@passes/api-client/apis"
import { FC } from "react"
import { ProfileUpdate } from "src/helpers/updateProfile"

import { EditProfile } from "./EditProfile"
import {
  EditProfileAction,
  ProfileImage,
  ProfileInformation,
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
          onSubmit={onSubmitEditProfile}
          onCloseEditProfile={onCloseEditProfile}
        />
      )}
      <div className="rounded-[20px] md:min-h-12 md:flex md:gap-[40px] md:pb-10">
        {/* Desktop */}
        <div className="relative hidden grid-cols-5 md:grid">
          <ProfileImage userId={profile.userId} />
          {ownsProfile && <EditProfileAction onEditProfile={onEditProfile} />}
          <div className="col-span-4 flex flex-col px-5 pt-4">
            <ProfileInformation
              displayName={profile.displayName}
              username={username}
              quote={profile.description}
              posts={creatorStats?.numPosts}
              likes={creatorStats?.numLikes}
              creatorId={profile.userId}
              discordUsername={profile.discordUsername}
              facebookUsername={profile.facebookUsername}
              instagramUsername={profile.instagramUsername}
              tiktokUsername={profile.tiktokUsername}
              twitchUsername={profile.twitchUsername}
              twitterUsername={profile.twitterUsername}
              youtubeUsername={profile.youtubeUsername}
              ownsProfile={ownsProfile}
              onChat={onChat}
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="align-center my-4 -mt-[220px] flex grid w-full content-center items-center justify-items-center gap-y-[16px] rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[16px] py-[13px] backdrop-blur-[100px] md:hidden">
          {/* <div className="absolute top-2 left-2">
            <Verified />
          </div> */}
          <ProfileImage userId={profile.userId} />
          <ProfileInformationMobile
            displayName={profile.displayName}
            username={username}
            description={profile.description}
            creatorId={profile.userId}
            discordUsername={profile.discordUsername}
            facebookUsername={profile.facebookUsername}
            instagramUsername={profile.instagramUsername}
            tiktokUsername={profile.tiktokUsername}
            twitchUsername={profile.twitchUsername}
            twitterUsername={profile.twitterUsername}
            youtubeUsername={profile.youtubeUsername}
            posts={creatorStats?.numPosts}
            likes={creatorStats?.numLikes}
            ownsProfile={ownsProfile}
            onChat={onChat}
          />
        </div>
      </div>
    </>
  )
}

export default ProfileDetails
