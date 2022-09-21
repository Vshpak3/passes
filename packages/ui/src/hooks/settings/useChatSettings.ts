import { CreatorSettingsApi } from "@passes/api-client"
import { wrapApi } from "src/helpers"

import { UpdateCreatorSettingsRequestDto } from "./../../../../api-client/src/models/UpdateCreatorSettingsRequestDto"

export const useChatSettings = () => {
  const chatApi = wrapApi(CreatorSettingsApi)

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
