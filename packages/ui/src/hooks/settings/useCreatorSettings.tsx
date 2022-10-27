import {
  CreatorSettingsApi,
  GetCreatorSettingsResponseDto,
  GetCreatorSettingsResponseDtoPayoutFrequencyEnum,
  UpdateCreatorSettingsRequestDto,
  UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum
} from "@passes/api-client"
import { useEffect } from "react"
import { toast } from "react-toastify"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"

type CreatorSettingsDto =
  | GetCreatorSettingsResponseDto
  | UpdateCreatorSettingsRequestDto

export type PayoutFrequencyEnum =
  | GetCreatorSettingsResponseDtoPayoutFrequencyEnum
  | UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum

const CACHE_KEY_NOTIFICATIONS = "/creator-settings"

export const useCreatorSettings = () => {
  const api = new CreatorSettingsApi()

  const {
    data: creatorSettings,
    isValidating: isLoading,
    mutate
  } = useSWR<CreatorSettingsDto>(CACHE_KEY_NOTIFICATIONS, async () => {
    return await api.getCreatorSettings()
  })

  const { mutate: _mutateManual } = useSWRConfig()

  const mutateManual = (update: UpdateCreatorSettingsRequestDto) =>
    _mutateManual(CACHE_KEY_NOTIFICATIONS, update, {
      populateCache: (
        update: UpdateCreatorSettingsRequestDto,
        original: GetCreatorSettingsResponseDto
      ) => {
        return Object.assign(original, update)
      },
      revalidate: false
    })

  async function updateCreatorSettings(
    newSettings: CreatorSettingsDto,
    successToastMessage = ""
  ) {
    try {
      const result = await api.updateCreatorSettings({
        updateCreatorSettingsRequestDto: newSettings
      })

      if (result.value) {
        if (successToastMessage) {
          mutateManual(newSettings)
          toast.success(successToastMessage)
        }
      } else {
        toast.error("Failed to update")
      }
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  useEffect(() => {
    if (!creatorSettings) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isLoading,
    creatorSettings,
    getCreatorSettings: mutate,
    updateCreatorSettings
  }
}
