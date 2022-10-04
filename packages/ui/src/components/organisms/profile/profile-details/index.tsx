import { MessagesApi } from "@passes/api-client/apis"
import { FC } from "react"

import {
  EditProfileAction,
  ProfileImage,
  ProfileInformation,
  ProfileInformationMobile
  // Verified
} from "./ProfileComponents"

interface ProfileDetailsDesktopProps {
  profile: any
  ownsProfile: any
  onEditProfile: any
  username: any
  creatorStats: any
}

const ProfileDetailsDesktop: FC<ProfileDetailsDesktopProps> = ({
  profile,
  ownsProfile,
  onEditProfile,
  username,
  creatorStats
}) => {
  const onChat = async () => {
    const api = new MessagesApi()
    await api.getOrCreateChannel({
      getChannelRequestDto: { userId: profile.userId }
    })
  }

  return (
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
  )
}

interface ProfileDetailsMobileProps {
  profile: any
  username: any
  ownsProfile: any
  creatorStats: any
}

const ProfileDetailsMobile: FC<ProfileDetailsMobileProps> = ({
  profile,
  username,
  ownsProfile,
  creatorStats
}) => {
  // eslint-disable-next-line sonarjs/no-identical-functions
  const onChat = async () => {
    const api = new MessagesApi()
    await api.getOrCreateChannel({
      getChannelRequestDto: { userId: profile.userId }
    })
  }

  return (
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
  )
}

interface ProfileDetailsProps {
  profile: any
  onEditProfile: any
  username: any
  ownsProfile: any
  creatorStats: any
}

const ProfileDetails: FC<ProfileDetailsProps> = ({
  profile,
  onEditProfile,
  username,
  ownsProfile,
  creatorStats
}) => {
  return (
    <div className="rounded-[20px] md:min-h-12 md:flex md:gap-[40px] md:pb-10">
      <ProfileDetailsDesktop
        ownsProfile={ownsProfile}
        onEditProfile={onEditProfile}
        profile={profile}
        username={username}
        creatorStats={creatorStats}
      />
      <ProfileDetailsMobile
        ownsProfile={ownsProfile}
        profile={profile}
        username={username}
        creatorStats={creatorStats}
      />
    </div>
  )
}

export default ProfileDetails
