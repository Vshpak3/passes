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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const privateProfileHandler = async (isPrivate: boolean) => {
    return null
  }

  return {
    privateProfileHandler,
    getCreatorSettings,
    updateCreatorSettings
  }
}
