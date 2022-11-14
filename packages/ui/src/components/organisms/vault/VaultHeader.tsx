import {
  ContentDto,
  GetVaultQueryRequestDtoOrderEnum
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction } from "react"

import { VaultMediaUpload } from "src/components/organisms/vault/VaultMediaUpload"
import { VaultNavigation } from "src/components/organisms/vault/VaultNavigation"
import { VaultCategory, VaultType } from "src/components/pages/tools/Vault"
import { useMedia } from "src/hooks/useMedia"

interface VaultHeaderProps {
  passSelectedItems?: (selectedItems: ContentDto[]) => void
  order: GetVaultQueryRequestDtoOrderEnum
  setOrder: Dispatch<SetStateAction<GetVaultQueryRequestDtoOrderEnum>>
  selectedItems: Array<ContentDto>
  setItems: (items: ContentDto[]) => void
  vaultCategory: VaultCategory
  setVaultType: Dispatch<SetStateAction<VaultType>>
  setVaultCategory: Dispatch<SetStateAction<VaultCategory>>
  vaultType: VaultType
}

export const VaultHeader: FC<VaultHeaderProps> = ({
  passSelectedItems,
  order,
  setOrder,
  selectedItems,
  setItems,
  vaultCategory,
  setVaultType,
  setVaultCategory,
  vaultType
}) => {
  const { files, setFiles, addNewMedia, onRemove } = useMedia()

  return (
    <>
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
    </>
  )
}
