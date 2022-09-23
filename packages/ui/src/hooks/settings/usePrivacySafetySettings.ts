import {
  CreatorSettingsApi,
  ProfileApi,
  UpdateCreatorSettingsRequestDto
} from "@passes/api-client"

export const usePrivacySafetySettings = () => {
  const profileApi = new ProfileApi()
  const creatorApi = new CreatorSettingsApi()

  const getCreatorSettings = async () => {
    return await creatorApi.getCreatorSettings()
  }

  const updateCreatorSettings = async (
    updateCreatorSettingsRequestDto: UpdateCreatorSettingsRequestDto
  ) => {
    return await creatorApi.updateCreatorSettings({
      updateCreatorSettingsRequestDto
    })
  }

  const privateProfileHandler = async (isPrivate: boolean) => {
    if (isPrivate) {
      return await profileApi.deactivateProfile()
    }
    return await profileApi.activateProfile()
  }

  return {
    privateProfileHandler,
    getCreatorSettings,
    updateCreatorSettings
  }
}
