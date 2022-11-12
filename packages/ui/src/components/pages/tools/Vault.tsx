import {
  ContentDto,
  GetVaultQueryRequestDtoCategoryEnum,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryRequestDtoTypeEnum
} from "@passes/api-client"
import { FC, useState } from "react"

import { VaultMediaGrid } from "src/components/organisms/vault/VaultMediaGrid"
import { VaultMediaUpload } from "src/components/organisms/vault/VaultMediaUpload"
import { VaultNavigation } from "src/components/organisms/vault/VaultNavigation"
import { MAX_FILE_COUNT } from "src/config/media-limits"
import { useMedia } from "src/hooks/useMedia"

interface VaultProps {
  passSelectedItems?: (selectedItems: ContentDto[]) => void
  scroll?: boolean
}

export type VaultType = GetVaultQueryRequestDtoTypeEnum | undefined
export type VaultCategory = GetVaultQueryRequestDtoCategoryEnum | undefined

export const Vault: FC<VaultProps> = ({
  passSelectedItems,
  scroll = false
}) => {
  const [selectedItems, setSelectedItems] = useState<Array<ContentDto>>([])
  const [vaultType, setVaultType] = useState<VaultType>()
  const [vaultCategory, setVaultCategory] = useState<VaultCategory>()
  const [order, setOrder] = useState<GetVaultQueryRequestDtoOrderEnum>(
    GetVaultQueryRequestDtoOrderEnum.Desc
  )
  const [isMaxFileCountSelected, setIsMaxFileCountSelected] = useState(false)
  const { files, setFiles, addNewMedia, onRemove } = useMedia()

  const setItems = (items: ContentDto[]) => {
    setSelectedItems(items)
    setIsMaxFileCountSelected(items.length === MAX_FILE_COUNT)
    if (passSelectedItems) {
      passSelectedItems(items)
    }
  }

  return (
    <div className="my-4 h-full w-full px-2 md:px-5">
      <VaultNavigation
        addNewMedia={addNewMedia}
        embedded={!!passSelectedItems}
        order={order}
        selectedItems={selectedItems}
        setOrder={setOrder}
        setSelectedItems={setItems}
        setVaultCategory={setVaultCategory}
        setVaultType={setVaultType}
        vaultCategory={vaultCategory}
        vaultType={vaultType}
      />
      <VaultMediaUpload
        addNewMedia={addNewMedia}
        files={files}
        onRemove={onRemove}
        setFiles={setFiles}
      />
      <VaultMediaGrid
        category={vaultCategory}
        isMaxFileCountSelected={isMaxFileCountSelected}
        order={order}
        scroll={scroll}
        selectedItems={selectedItems}
        setSelectedItems={setItems}
        type={vaultType}
      />
    </div>
  )
}
