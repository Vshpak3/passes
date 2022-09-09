import { ContentDto } from "@passes/api-client"
import {
  ContentApi,
  GetVaultContentCategoryEnum,
  GetVaultContentTypeEnum
} from "@passes/api-client/apis"
import { useCallback, useEffect, useState } from "react"
import { wrapApi } from "src/helpers"

const api = wrapApi(ContentApi)

export type TVaultData = ContentDto[] | null
export type TSelectedVaultData = ContentDto[]
export type TVaultType = GetVaultContentTypeEnum | undefined
export type TVaultCategory = GetVaultContentCategoryEnum | undefined

interface IGetVaultData {
  type: TVaultType
  category: TVaultCategory
}

async function fetchVaultData({ type, category }: IGetVaultData) {
  const data = await api.getVaultContent({
    type,
    category
  })
  /**
   * TODO: We are mapping the data to include mocked data that is not yet
   * available from the API. Once the data is available, we can
   * return data.contents.
   *
   * We are missing the following items from the api:
   * - signedUrl: string
   * - date: Date
   * - totalLikes: number
   * - totalTips: number
   */
  const MOCKED: ContentDto[] = data.contents.map((data) => ({
    ...data,
    signedUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  }))
  return MOCKED

  // return data.contents
}

const useVaultGallery = () => {
  const [isMounted, setMounted] = useState(false)
  const [vaultContent, setVaultContent] = useState<TVaultData>(null)
  const [selectedItems, setSelectedItems] = useState<Array<string>>([])
  const [vaultType, setVaultType] = useState<
    GetVaultContentTypeEnum | undefined
  >(undefined)

  const [vaultCategory, setVaultCategory] = useState<
    GetVaultContentCategoryEnum | undefined
  >(undefined)

  const fetchVaultItems = useCallback(
    async ({ type = undefined, category = undefined }: IGetVaultData) => {
      const data = await fetchVaultData({
        type,
        category
      })
      setVaultContent(data)
    },
    []
  )

  const fetchVaultType = (type: TVaultType) => {
    setSelectedItems([])
    setVaultType(type)
    fetchVaultItems({ type, category: vaultCategory })
  }
  const fetchVaultCategory = (category: TVaultCategory) => {
    setSelectedItems([])
    setVaultCategory(category)
    fetchVaultItems({ type: vaultType, category })
  }

  useEffect(() => {
    async function getInitialData() {
      const data = await fetchVaultData({
        type: undefined,
        category: undefined
      })
      setVaultContent(data)
    }
    if (!isMounted) {
      getInitialData()
      setMounted(true)
    }
  }, [isMounted])

  return {
    vaultType,
    vaultCategory,
    vaultContent,
    fetchVaultType,
    fetchVaultCategory,
    setVaultContent,
    selectedItems,
    setSelectedItems
  }
}

export default useVaultGallery
