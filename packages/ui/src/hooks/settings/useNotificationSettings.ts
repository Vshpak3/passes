import {
  NotificationsApi,
  UpdateNotificationSettingsRequestDto
} from "@passes/api-client"
import { wrapApi } from "src/helpers"

export const useNotificationSettings = () => {
  const notificationApi = wrapApi(NotificationsApi)

  const getNotificationSettings = async () => {
    return await notificationApi.getNotificationSettings()
  }

  const updateNotificationSettings = async (
    updatedNotifications: UpdateNotificationSettingsRequestDto
  ) => {
    return await notificationApi.updateNotificationSettings({
      updateNotificationSettingsRequestDto: updatedNotifications
    })
  }

  return { getNotificationSettings, updateNotificationSettings }
}
