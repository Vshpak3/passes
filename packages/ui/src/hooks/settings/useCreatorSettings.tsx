import {
  CreatorSettingsApi,
  GetCreatorSettingsResponseDto,
  UpdateCreatorSettingsRequestDto
} from "@passes/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { errorMessage } from "src/helpers/error"

type CreatorSettingsDto =
  | GetCreatorSettingsResponseDto
  | UpdateCreatorSettingsRequestDto
const useCreatorSettings = () => {
  const api = new CreatorSettingsApi()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [creatorSettings, setCreatorSettings] = useState<CreatorSettingsDto>({})

  async function getCreatorSettings() {
    try {
      setIsLoading(true)
      const response = await api.getCreatorSettings()
      setCreatorSettings(response)
    } catch (error: any) {
      console.error(error)
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateCreatorSettings(
    newSettings: CreatorSettingsDto,
    successToastMessage = ""
  ) {
    try {
      setIsUpdating(true)
      const result = await api.updateCreatorSettings({
        updateCreatorSettingsRequestDto: newSettings
      })
      if (result.value) {
        if (successToastMessage) {
          toast.success(successToastMessage)
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
        await getCreatorSettings()
      } else {
        toast.error("failed to update")
      }
    } catch (error: any) {
      return await errorMessage(error, true)
    } finally {
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    getCreatorSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isLoading,
    isUpdating,
    creatorSettings,
    getCreatorSettings,
    updateCreatorSettings
  }
}

export default useCreatorSettings
