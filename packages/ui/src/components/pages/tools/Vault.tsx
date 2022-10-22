import {
  ContentDto,
  GetVaultQueryRequestDtoCategoryEnum,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryRequestDtoTypeEnum
} from "@passes/api-client"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { VaultMediaGrid } from "src/components/organisms/vault/VaultMediaGrid"
import { VaultNavigation } from "src/components/organisms/vault/VaultNavigation"

interface VaultProps {
  passSelectedItems?: (selectedItems: ContentDto[]) => void
}

export type VaultType = GetVaultQueryRequestDtoTypeEnum | undefined
export type VaultCategory = GetVaultQueryRequestDtoCategoryEnum | undefined

const MAX_FILE_COUNT = 10

const checkDifferentTypesSelected = (selectedItems: ContentDto[]) => {
  const typesSelected: string[] = []

  selectedItems.forEach((item) => {
    if (!typesSelected.find((el) => el === item.contentType)) {
      typesSelected.push(item.contentType)
    }
  })
  return typesSelected.length > 1 ? true : false
}

export const Vault: FC<VaultProps> = ({ passSelectedItems }) => {
  const [selectedItems, setSelectedItems] = useState<Array<ContentDto>>([])
  const [deletedItems, setDeletedItems] = useState<Array<ContentDto>>([])
  const [vaultType, setVaultType] = useState<VaultType>()
  const [vaultCategory, setVaultCategory] = useState<VaultCategory>()
  const [order, setOrder] = useState<GetVaultQueryRequestDtoOrderEnum>(
    GetVaultQueryRequestDtoOrderEnum.Desc
  )
  const [isVideoSelected, setIsVideoSelected] = useState(false)
  const [isMaxFileCountSelected, setIsMaxFileCountSelected] = useState(false)
  const [isDiffTypesSelected, setIsDiffTypesSelected] = useState(false)

  useEffect(() => {
    if (!selectedItems.length) {
      setIsVideoSelected(false)
      setIsDiffTypesSelected(false)
      setIsMaxFileCountSelected(false)
      return
    }

    // check if video file is selected
    setIsVideoSelected(
      !!selectedItems.find((elem) => elem.contentType === "video")
    )

    // check different types
    setIsDiffTypesSelected(checkDifferentTypesSelected(selectedItems))

    // check max file count
    setIsMaxFileCountSelected(selectedItems.length === MAX_FILE_COUNT)
  }, [selectedItems])

  const setItems = (items: ContentDto[]) => {
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
          content: JSON.stringify(
            selectedItems.map(({ contentId, contentType }) => ({
              contentId,
              contentType
            }))
          )
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
        isDiffTypesSelected={isDiffTypesSelected}
      />

      <VaultMediaGrid
        selectedItems={selectedItems}
        setSelectedItems={setItems}
        deletedItems={deletedItems}
        order={order}
        category={vaultCategory}
        type={vaultType}
        isVideoSelected={isVideoSelected}
        isMaxFileCountSelected={isMaxFileCountSelected}
      />
    </div>
  )
}
