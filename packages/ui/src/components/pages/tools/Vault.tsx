import {
  ContentDto,
  GetVaultQueryRequestDtoCategoryEnum,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryRequestDtoTypeEnum
} from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { VaultMediaGrid } from "src/components/organisms/vault/VaultMediaGrid"
import { VaultNavigation } from "src/components/organisms/vault/VaultNavigation"

interface VaultProps {
  passSelectedItems?: (selectedItems: string[]) => void
}

export type TVaultData = ContentDto[] | null
export type TSelectedVaultData = ContentDto[]
export type TVaultType = GetVaultQueryRequestDtoTypeEnum | undefined
export type TVaultCategory = GetVaultQueryRequestDtoCategoryEnum | undefined
const MAX_FILE_COUNT = 10

const checkDifferentTypesSelected = (selectedItemsFullData: ContentDto[]) => {
  const typesSelected: string[] = []

  selectedItemsFullData.forEach((item) => {
    if (!typesSelected.find((el) => el === item.contentType)) {
      typesSelected.push(item.contentType)
    }
  })
  return typesSelected.length > 1 ? true : false
}

export const Vault = ({ passSelectedItems }: VaultProps) => {
  const [selectedItems, setSelectedItems] = useState<Array<string>>([])
  const [selectedItemsFullData, setSelectedItemsFullData] = useState<
    Array<ContentDto>
  >([])
  const [deletedItems, setDeletedItems] = useState<Array<string>>([])
  const [vaultType, setVaultType] = useState<
    GetVaultQueryRequestDtoTypeEnum | undefined
  >(undefined)

  const [vaultCategory, setVaultCategory] = useState<
    GetVaultQueryRequestDtoCategoryEnum | undefined
  >(undefined)
  const [order, setOrder] = useState<GetVaultQueryRequestDtoOrderEnum>(
    GetVaultQueryRequestDtoOrderEnum.Desc
  )

  const [isVideoSelected, setIsVideoSelected] = useState(false)
  const [isMaxFileCountSelected, setIsMaxFileCountSelected] = useState(false)
  const [isDiffTypesSelected, setIsDiffTypesSelected] = useState(false)

  useEffect(() => {
    if (!selectedItemsFullData.length) {
      setIsVideoSelected(false)
      setIsDiffTypesSelected(false)
      setIsMaxFileCountSelected(false)
      return
    }

    // check if video file is selected
    setIsVideoSelected(
      !!selectedItemsFullData.find((elem) => elem.contentType === "video")
    )

    // check different types
    setIsDiffTypesSelected(checkDifferentTypesSelected(selectedItemsFullData))

    // check max file count
    setIsMaxFileCountSelected(selectedItemsFullData.length === MAX_FILE_COUNT)
  }, [selectedItemsFullData])

  const setItems = (items: string[]) => {
    setSelectedItems(items)
    if (passSelectedItems) {
      passSelectedItems(items)
    }
  }
  const router = useRouter()
  const pushToMessages = () => {
    router.push(
      {
        pathname: "/messages",
        query: {
          contentIds: selectedItems
        }
      },
      "/messages"
    )
  }
  return (
    <div className="mx-auto w-full px-2 md:px-5 sidebar-collapse:max-w-[1100px]">
      <VaultNavigation
        selectedItems={selectedItems}
        setSelectedItems={setItems}
        vaultType={vaultType}
        vaultCategory={vaultCategory}
        setVaultCategory={setVaultCategory}
        setVaultType={setVaultType}
        pushToMessages={pushToMessages}
        embedded={!!passSelectedItems}
        setOrder={setOrder}
        order={order}
        deletedItems={deletedItems}
        setDeletedItems={setDeletedItems}
        setSelectedItemsFullData={setSelectedItemsFullData}
        isDiffTypesSelected={isDiffTypesSelected}
      />

      <VaultMediaGrid
        selectedItems={selectedItems}
        setSelectedItems={setItems}
        deletedItems={deletedItems}
        order={order}
        category={vaultCategory}
        type={vaultType}
        selectedItemsFullData={selectedItemsFullData}
        setSelectedItemsFullData={setSelectedItemsFullData}
        isVideoSelected={isVideoSelected}
        isMaxFileCountSelected={isMaxFileCountSelected}
      />
    </div>
  )
}
