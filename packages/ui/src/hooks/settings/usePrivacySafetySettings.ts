import {
  CreatorSettingsApi,
  UpdateCreatorSettingsRequestDto
} from "@passes/api-client"

export const usePrivacySafetySettings = () => {
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
    return null
  }

  return {
    privateProfileHandler,
    getCreatorSettings,
    updateCreatorSettings
  }
}
