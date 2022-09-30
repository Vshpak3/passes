import { ProfileApi, UserApi } from "@passes/api-client"

import { ContentService } from "../helpers"

export async function updateProfile(values: Record<string, any>) {
  const { profileImage, profileCoverImage, isAdult, displayName, ...rest } =
    values

  const userApi = new UserApi()

  if (isAdult) {
    await userApi.makeAdult()
  }

  if (displayName) {
    await userApi.setDisplayName({
      updateDisplayNameRequestDto: { displayName }
    })
  }

  const contentService = new ContentService()

  const [profileImageUrl, profileCoverImageUrl] = await Promise.all([
    profileImage?.length
      ? contentService.uploadProfileImage(profileImage[0])
      : undefined,
    profileCoverImage?.length
      ? contentService.uploadProfileBanner(profileCoverImage[0])
      : undefined
  ])

  const newValues = { ...rest }

  newValues.fullName = `${values.firstName} ${values.lastName}`

  if (profileImageUrl) {
    newValues.profileImageUrl = profileImageUrl
  }
  if (profileCoverImageUrl) {
    newValues.profileCoverImageUrl = profileCoverImageUrl
  }

  const api = new ProfileApi()
  await api.createOrUpdateProfile({
    createOrUpdateProfileRequestDto: {
      ...rest
    }
  })

  return newValues
}
