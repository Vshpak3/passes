import {
  ContentDto,
  GetVaultQueryRequestDtoCategoryEnum,
  GetVaultQueryRequestDtoTypeEnum
} from "@passes/api-client"
import { ContentApi } from "@passes/api-client/apis"
import { useCallback, useEffect, useState } from "react"

const api = new ContentApi()

export type TVaultData = ContentDto[] | null
export type TSelectedVaultData = ContentDto[]
export type TVaultType = GetVaultQueryRequestDtoTypeEnum | undefined
export type TVaultCategory = GetVaultQueryRequestDtoCategoryEnum | undefined

interface GetVaultDataProps {
  type: TVaultType
  category: TVaultCategory
}

async function fetchVaultData({
  type,
  category
}: GetVaultDataProps): Promise<ContentDto[]> {
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
  return (
    await api.getVaultContent({
      getVaultQueryRequestDto: {
        category,
        type
      }
    })
  ).data

  // return data.contents
}

export const useVaultGallery = () => {
  const [isMounted, setMounted] = useState(false)
  const [vaultContent, setVaultContent] = useState<TVaultData>(null)
  const [selectedItems, setSelectedItems] = useState<Array<string>>([])
  const [vaultType, setVaultType] = useState<
    GetVaultQueryRequestDtoTypeEnum | undefined
  >(undefined)

  const [vaultCategory, setVaultCategory] = useState<
    GetVaultQueryRequestDtoCategoryEnum | undefined
  >(undefined)

  const fetchVaultItems = useCallback(
    async ({ type = undefined, category = undefined }: GetVaultDataProps) => {
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
