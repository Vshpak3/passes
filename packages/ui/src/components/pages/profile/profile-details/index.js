import EditProfileIcon from "public/icons/profile-edit-icon.svg"
import React from "react"

import { ProfileInformation, ProfilePhoto } from "./ProfileComponents"

const ProfileDetails = ({ profile, onEditProfile, username, ownsProfile }) => (
  <div className="min-h-12 flex gap-[40px] rounded-[20px] pb-10">
    {ownsProfile && (
      <div className="absolute my-2 flex w-full items-center justify-between">
        <div>
          <EditProfileIcon
            className="cursor-pointer stroke-[#ffffff] hover:stroke-passes-secondary-color"
            onClick={onEditProfile}
          />
        </div>
      </div>
    )}
    <ProfilePhoto url={profile.profileImageUrl} />
    <div className="flex flex-col pt-4">
      <ProfileInformation
        displayName={profile.displayName}
        username={username}
        quote={profile.coverDescription}
        posts={profile.postsCount}
        likes={profile.likes}
        instagramUrl={profile.instagramUrl}
        tiktokUrl={profile.tiktokUrl}
        youtubeUrl={profile.youtubeUrl}
        discordUrl={profile.discordUrl}
        twitchUrl={profile.twitchUrl}
        facebookUrl={profile.facebookUrl}
        twitterUrl={profile.twitterUrl}
      />
    </div>
  </div>
)

export default ProfileDetails
