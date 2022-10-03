import { MessagesApi } from "@passes/api-client/apis"
import React from "react"
import { ContentService } from "src/helpers"

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
  username,
  creatorStats
}: any) => {
  const onChat = async () => {
    const api = new MessagesApi()
    await api.getOrCreateChannel({
      getChannelRequestDto: { userId: profile.userId }
    })
  }

  return (
    <div className="relative hidden grid-cols-5 md:grid">
      <ProfilePhoto url={ContentService.profileThumbnail(profile.userId)} />
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

const ProfileDetailsMobile = ({
  profile,
  username,
  ownsProfile,
  creatorStats
}: any) => {
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
      <ProfilePhoto url={ContentService.profileThumbnail(profile.userId)} />
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

const ProfileDetails = ({
  profile,
  onEditProfile,
  username,
  ownsProfile,
  creatorStats
}: any) => {
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
