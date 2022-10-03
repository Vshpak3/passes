import {
  NotificationsApi,
  UpdateNotificationSettingsRequestDto
} from "@passes/api-client"

const useNotificationSettings = () => {
  const notificationApi = new NotificationsApi()

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

export default useNotificationSettings
