import { ProfileApi, UserApi } from "@passes/api-client"

import { ContentService } from "../helpers"

export interface ProfileUpdate {
  username?: string
  displayName?: string
  description?: string

  profileImage?: File
  profileBannerImage?: File

  discordUsername?: string
  facebookUsername?: string
  instagramUsername?: string
  tiktokUsername?: string
  twitchUsername?: string
  twitterUsername?: string
  youtubeUsername?: string

  isAdult?: boolean
}

export async function updateProfile(values: ProfileUpdate): Promise<void> {
  const {
    profileImage,
    profileBannerImage,
    username,
    displayName,
    isAdult,
    ...rest
  } = values

  const userApi = new UserApi()
  const contentService = new ContentService()
  const profileApi = new ProfileApi()

  await Promise.all([
    username
      ? userApi.setUsername({
          updateUsernameRequestDto: { username }
        })
      : undefined,

    displayName
      ? await userApi.setDisplayName({
          updateDisplayNameRequestDto: { displayName }
        })
      : undefined,

    isAdult ? await userApi.makeAdult() : undefined,

    profileImage ? contentService.uploadProfileImage(profileImage) : undefined,

    profileBannerImage
      ? contentService.uploadProfileBanner(profileBannerImage)
      : undefined,

    Object.values(rest).some((x) => x)
      ? profileApi.createOrUpdateProfile({
          createOrUpdateProfileRequestDto: {
            ...rest
          }
        })
      : undefined
  ])
}
