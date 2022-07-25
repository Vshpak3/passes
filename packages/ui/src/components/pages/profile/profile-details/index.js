import React from "react"

import {
  ProfileAdditionalInformation,
  ProfileInformation,
  ProfilePhoto,
  ProfileSocialMedia,
  Verified
} from "./ProfileComponents"

const ProfileDetails = ({ profile }) => (
  <div className="min-h-12 flex flex-col items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-4 pt-3 pb-10 backdrop-blur-[100px]">
    <Verified isVerified={profile.isVerified} />
    <ProfilePhoto url={profile.profileImageUrl} />
    <ProfileInformation
      fullName={profile.fullName}
      userId={profile.userId}
      description={profile.description}
    />
    <ProfileSocialMedia
      instagramUrl={profile.instagramUrl}
      tiktokUrl={profile.tiktokUrl}
      youtubeUrl={profile.youtubeUrl}
      discordUrl={profile.discordUrl}
      twitchUrl={profile.twitchUrl}
      facebookUrl={profile.facebookUrl}
      twitterUrl={profile.twitterUrl}
    />
    <ProfileAdditionalInformation
      posts={profile.postsCount}
      likes={profile.likes}
    />
  </div>
)

export default ProfileDetails
