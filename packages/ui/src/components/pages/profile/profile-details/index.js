import EditProfileIcon from "public/icons/profile-edit-icon.svg"
import React from "react"

import {
  ProfileAdditionalInformation,
  ProfileInformation,
  ProfilePhoto,
  ProfileSocialMedia,
  Verified
} from "./ProfileComponents"

const ProfileDetails = ({ profile, onEditProfile, username, ownsProfile }) => (
  <div className="min-h-12 flex flex-col items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/30 px-4 pt-3 pb-10 backdrop-blur-[100px]">
    <div className="flex w-full items-center justify-between">
      <Verified isVerified={profile.isVerified} />
      <div>
        {ownsProfile && (
          <EditProfileIcon
            className="cursor-pointer stroke-[#ffffff] hover:stroke-[#BF7AF0]"
            onClick={onEditProfile}
          />
        )}
      </div>
    </div>
    <ProfilePhoto url={profile.profileImageUrl} />
    <ProfileInformation
      displayName={profile.displayName}
      username={username}
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
