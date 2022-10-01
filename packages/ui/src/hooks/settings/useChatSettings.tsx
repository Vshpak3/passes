import {
  CreatorSettingsApi,
  UpdateCreatorSettingsRequestDto
} from "@passes/api-client"

export const useChatSettings = () => {
  const chatApi = new CreatorSettingsApi()

  const getChatSettings = async () => {
    return await chatApi.getCreatorSettings()
  }

  const updateChatSettings = async (
    updateCreatorSettingsRequestDto: UpdateCreatorSettingsRequestDto
  ) => {
    return await chatApi.updateCreatorSettings({
      updateCreatorSettingsRequestDto
    })
  }

  return { getChatSettings, updateChatSettings }
}
