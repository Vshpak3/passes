import { MessagesApi } from "@passes/api-client/apis"
import React from "react"

import {
  EditProfileAction,
  ProfileInformation,
  ProfileInformationMobile,
  ProfilePhoto
  // Verified
} from "./ProfileComponents"

const ProfileDetailsDesktop = ({
  profile,
  ownsProfile,
  onEditProfile,
  username
}) => {
  const onChat = async () => {
    const api = new MessagesApi()
    await api.getOrCreateChannel({
      getChannelRequestDto: { userId: profile.userId }
    })
  }

  return (
    <div className="relative hidden grid-cols-5 md:grid">
      <ProfilePhoto url={profile.profileImageUrl} />
      {ownsProfile && <EditProfileAction onEditProfile={onEditProfile} />}
      <div className="col-span-4 flex flex-col px-5 pt-4">
        <ProfileInformation
          displayName={profile.coverTitle}
          username={username}
          quote={profile.coverDescription}
          posts={profile.postsCount}
          likes={profile.likes}
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

const ProfileDetailsMobile = ({ profile, username, ownsProfile }) => {
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
      <ProfilePhoto url={profile.profileImageUrl} />
      <ProfileInformationMobile
        displayName={profile.displayName}
        username={username}
        description={profile.coverDescription}
        creatorId={profile.userId}
        discordUsername={profile.discordUsername}
        facebookUsername={profile.facebookUsername}
        instagramUsername={profile.instagramUsername}
        tiktokUsername={profile.tiktokUsername}
        twitchUsername={profile.twitchUsername}
        twitterUsername={profile.twitterUsername}
        youtubeUsername={profile.youtubeUsername}
        posts={profile.postsCount}
        likes={profile.likes}
        ownsProfile={ownsProfile}
        onChat={onChat}
      />
    </div>
  )
}

const ProfileDetails = ({ profile, onEditProfile, username, ownsProfile }) => {
  return (
    <div className="rounded-[20px] md:min-h-12 md:flex md:gap-[40px] md:pb-10">
      <ProfileDetailsDesktop
        ownsProfile={ownsProfile}
        onEditProfile={onEditProfile}
        profile={profile}
        username={username}
      />
      <ProfileDetailsMobile
        ownsProfile={ownsProfile}
        profile={profile}
        username={username}
      />
    </div>
  )
}

export default ProfileDetails
