import { GetProfileResponseDto, ProfileApi, UserApi } from "@passes/api-client"
import { pickBy } from "lodash"

import { ContentService } from "src/helpers/content"

export interface ProfileUpdate
  extends Pick<
    GetProfileResponseDto,
    | "displayName"
    | "description"
    | "discordUsername"
    | "facebookUsername"
    | "instagramUsername"
    | "tiktokUsername"
    | "twitchUsername"
    | "twitterUsername"
    | "youtubeUsername"
    | "isAdult"
  > {
  username?: string
  profileImage: File[]
  profileBannerImage: File[]
}

export async function updateProfile(
  values: Partial<ProfileUpdate>
): Promise<void> {
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

    profileImage?.length === 1
      ? contentService.uploadProfileImage(profileImage[0])
      : undefined,

    profileBannerImage?.length === 1
      ? contentService.uploadProfileBanner(profileBannerImage[0])
      : undefined,

    Object.values(rest).some((x) => x?.trim())
      ? profileApi.createOrUpdateProfile({
          createOrUpdateProfileRequestDto: {
            ...pickBy(rest, (v) => v && v.trim())
          }
        })
      : undefined
  ])

  if (profileImage?.length === 1) {
    // Don't bother awaiting this
    profileApi.updateProfileImage()
  }
}
