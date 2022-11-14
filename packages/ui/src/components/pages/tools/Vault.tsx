import {
  ContentDto,
  GetVaultQueryRequestDtoCategoryEnum,
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryRequestDtoTypeEnum
} from "@passes/api-client"
import { FC, useState } from "react"

import { VaultHeader } from "src/components/organisms/vault/VaultHeader"
import { VaultMediaGrid } from "src/components/organisms/vault/VaultMediaGrid"
import { MAX_FILE_COUNT } from "src/config/media-limits"

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
  const [isMaxFileCountSelected, setIsMaxFileCountSelected] = useState(false)
  const [order, setOrder] = useState<GetVaultQueryRequestDtoOrderEnum>(
    GetVaultQueryRequestDtoOrderEnum.Desc
  )
  const [vaultCategory, setVaultCategory] = useState<VaultCategory>()
  const [vaultType, setVaultType] = useState<VaultType>()
  const setItems = (items: ContentDto[]) => {
    setSelectedItems(items)
    setIsMaxFileCountSelected(items.length === MAX_FILE_COUNT)
    if (passSelectedItems) {
      passSelectedItems(items)
    }
  }
  return (
    <div className="my-4 h-full w-full px-2 md:px-5">
      <VaultHeader
        order={order}
        passSelectedItems={passSelectedItems}
        selectedItems={selectedItems}
        setItems={setItems}
        setOrder={setOrder}
        setVaultCategory={setVaultCategory}
        setVaultType={setVaultType}
        vaultCategory={vaultCategory}
        vaultType={vaultType}
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
