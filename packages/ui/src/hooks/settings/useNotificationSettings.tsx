import {
  GetNotificationSettingsResponseDto,
  NotificationsApi,
  UpdateNotificationSettingsRequestDto
} from "@passes/api-client"
import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"

const CACHE_KEY_NOTIFICATIONS = "/settings/notification/"

export const useNotificationSettings = () => {
  const api = new NotificationsApi()

  const { data: notificationSettings, mutate } = useSWR(
    CACHE_KEY_NOTIFICATIONS,
    async () => {
      return await api.getNotificationSettings()
    }
  )

  useEffect(() => {
    if (!notificationSettings) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate])

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: UpdateNotificationSettingsRequestDto) =>
    _mutateManual(CACHE_KEY_NOTIFICATIONS, update, {
      populateCache: (
        update: UpdateNotificationSettingsRequestDto,
        original: GetNotificationSettingsResponseDto
      ) => {
        return Object.assign(original, update)
      },
      revalidate: false
    })

  const updateNotificationSettings = async (
    updatedNotifications: UpdateNotificationSettingsRequestDto
  ) => {
    await api.updateNotificationSettings({
      updateNotificationSettingsRequestDto: updatedNotifications
    })
    mutateManual(updatedNotifications)
    mutate()
  }

  return { notificationSettings, updateNotificationSettings }
}
