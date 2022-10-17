import {
  ContentApi,
  ContentDto,
  GetVaultQueryRequestDtoOrderEnum
} from "@passes/api-client"
import { FC, useState } from "react"
import { VaultDeleteButton } from "src/components/atoms/vault"
import { VaultAddToDropdown } from "src/components/molecules/vault/VaultAddTo"
import { VaultDeleteModal } from "src/components/molecules/vault/VaultDelete"
import { VaultFilterContainer } from "src/components/molecules/vault/VaultFilter"
import { VaultSelectContainer } from "src/components/molecules/vault/VaultSelect"
import { VaultSortDropdown } from "src/components/molecules/vault/VaultSort"
import { TVaultCategory, TVaultType } from "src/components/pages/tools/Vault"

interface VaultNavigationProps {
  selectedItems: string[]
  setSelectedItems: (items: string[]) => void
  setVaultType: (type: TVaultType) => void
  setVaultCategory: (category: TVaultCategory) => void
  setOrder: (order: GetVaultQueryRequestDtoOrderEnum) => void
  vaultType: TVaultType
  vaultCategory: TVaultCategory
  pushToMessages: () => void
  order: GetVaultQueryRequestDtoOrderEnum
  deletedItems: string[]
  setDeletedItems: (items: string[]) => void
  embedded?: boolean
  setSelectedItemsFullData: (items: ContentDto[]) => void
  isDiffTypesSelected: boolean
}

export const VaultNavigation: FC<VaultNavigationProps> = ({
  selectedItems,
  vaultType,
  vaultCategory,
  setVaultType,
  setVaultCategory,
  setOrder,
  setSelectedItems,
  pushToMessages,
  order,
  deletedItems,
  setDeletedItems,
  embedded = false,
  isDiffTypesSelected = false,
  setSelectedItemsFullData
}) => {
  const deselectAll = () => {
    setSelectedItems([])
    setSelectedItemsFullData([])
  }
  const [deleteModalActive, setDeleteModalActive] = useState(false)
  const toggleDeleteModal = () => setDeleteModalActive(!deleteModalActive)

  return (
    <div className="-mt-[180px] mb-[28px] flex w-full flex-col justify-between">
      <div className="align-items flex items-center justify-between">
        <div className="align-items text-[24px] font-bold text-white">
          Creator Vault
        </div>
        {!embedded && (
          <div className="align-center items-align flex justify-center">
            {selectedItems && selectedItems?.length > 0 && (
              <>
                {isDiffTypesSelected && (
                  <div>
                    10 photos or 1 video can be posted at any given time
                  </div>
                )}
                <VaultDeleteButton toggleDeleteModal={toggleDeleteModal} />
                {!isDiffTypesSelected && (
                  <VaultAddToDropdown
                    // TODO: connect with API to get selected items and add to new message
                    onAddToMessage={() => pushToMessages()}
                    // TODO: connect with API to get selected items and add to new post
                    // eslint-disable-next-line no-console
                    onAddToPost={() => console.log("add to post")}
                  />
                )}
              </>
            )}
            <VaultSortDropdown order={order} setOrder={setOrder} />
          </div>
        )}
      </div>
      <VaultSelectContainer
        selectedItems={selectedItems}
        deselectAll={deselectAll}
      />
      <VaultFilterContainer
        vaultType={vaultType}
        vaultCategory={vaultCategory}
        setVaultType={setVaultType}
        setVaultCategory={setVaultCategory}
      />
      <VaultDeleteModal
        toggleDeleteModal={toggleDeleteModal}
        deleteModalActive={deleteModalActive}
        // TODO: connect with API to get selected items and delete items
        // eslint-disable-next-line no-console
        onDeleteVaultItems={async () => {
          const api = new ContentApi()
          await api.deleteContent({
            deleteContentRequestDto: { contentIds: selectedItems }
          })
          setDeletedItems([...deletedItems, ...selectedItems])
        }}
        setDeleteModalActive={setDeleteModalActive}
      />
    </div>
  )
}
