import {
  ContentApi,
  GetProfileResponseDto,
  ProfileApi,
  UserApi
} from "@passes/api-client"
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
  profileBanner: File[]
  deleteProfileBanner?: boolean
}

export async function updateProfile(
  values: Partial<ProfileUpdate>
): Promise<void> {
  const {
    profileImage,
    profileBanner,
    deleteProfileBanner,
    username,
    displayName,
    isAdult,
    ...rest
  } = values

  console.log("DELETE BANNER", deleteProfileBanner)

  const userApi = new UserApi()
  const contentApi = new ContentApi()
  const contentService = new ContentService()
  const profileApi = new ProfileApi()

  await Promise.allSettled([
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

    profileBanner?.length === 1
      ? contentService.uploadProfileBanner(profileBanner[0])
      : deleteProfileBanner
      ? contentApi.deleteProfileBanner()
      : undefined,

    Object.values(rest).some((x) => x?.trim())
      ? profileApi.createOrUpdateProfile({
          createOrUpdateProfileRequestDto: {
            ...pickBy(rest, (v) => v && v.trim())
          }
        })
      : undefined
  ])
}
