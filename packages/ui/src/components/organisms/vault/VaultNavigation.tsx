import {
  ContentApi,
  ContentDto,
  GetVaultQueryRequestDtoOrderEnum
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"

import { VaultAddButton, VaultDeleteButton } from "src/components/atoms/vault"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { VaultAddToDropdown } from "src/components/molecules/vault/VaultAddTo"
import { VaultFilterContainer } from "src/components/molecules/vault/VaultFilter"
import { VaultSelectContainer } from "src/components/molecules/vault/VaultSelect"
import {
  SortDropdown,
  SortOption
} from "src/components/organisms/creator-tools/lists/SortDropdown"
import { VaultCategory, VaultType } from "src/components/pages/tools/Vault"
import { ContentFile } from "src/hooks/useMedia"

type OrderType = "recent" | "oldest"

const sortOptions: SortOption<OrderType>[] = [
  { orderType: "recent" },
  { orderType: "oldest" }
]

interface VaultNavigationProps {
  selectedItems: ContentDto[]
  setFiles: Dispatch<SetStateAction<ContentFile[]>>
  setSelectedItems: (items: ContentDto[]) => void
  setVaultType: (type: VaultType) => void
  setVaultCategory: (category: VaultCategory) => void
  setOrder: (order: GetVaultQueryRequestDtoOrderEnum) => void
  vaultType: VaultType
  vaultCategory: VaultCategory
  pushToMessages: () => void
  order: GetVaultQueryRequestDtoOrderEnum
  deletedItems: ContentDto[]
  setDeletedItems: (items: ContentDto[]) => void
  embedded?: boolean
}

export const VaultNavigation: FC<VaultNavigationProps> = ({
  selectedItems,
  setSelectedItems,
  vaultType,
  vaultCategory,
  setVaultType,
  setVaultCategory,
  setOrder,
  pushToMessages,
  order,
  deletedItems,
  setDeletedItems,
  setFiles,
  embedded = false
}) => {
  const deselectAll = () => {
    setSelectedItems([])
  }
  const [deleteModalActive, setDeleteModalActive] = useState(false)
  const toggleDeleteModal = () => setDeleteModalActive(!deleteModalActive)

  const onSortSelect = useCallback(
    (option: SortOption<OrderType>) => {
      setOrder(option.orderType === "recent" ? "desc" : "asc")
    },
    [setOrder]
  )

  const handleVaultDeleteItems = async () => {
    // TODO: connect with API to get selected items and delete items
    const api = new ContentApi()
    await api.deleteContent({
      deleteContentRequestDto: {
        contentIds: selectedItems.map((c) => c.contentId)
      }
    })
    setDeletedItems([...deletedItems, ...selectedItems])
    setSelectedItems([])
  }

  return (
    <div className="-mt-[180px] mb-[28px] flex w-full flex-col justify-between">
      <div className="align-items flex items-center justify-between">
        <div className="align-items text-[24px] font-bold text-white">
          Creator Vault
        </div>
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
      <DeleteConfirmationModal
        isOpen={deleteModalActive}
        onDelete={handleVaultDeleteItems}
        setOpen={setDeleteModalActive}
        onCancel={toggleDeleteModal}
      />
      {!embedded && (
        <div className="align-center items-align flex justify-center">
          {selectedItems && selectedItems?.length > 0 && (
            <>
              <div>20 media files can be posted at any given time</div>
              <VaultDeleteButton toggleDeleteModal={toggleDeleteModal} />
              <VaultAddToDropdown
                // TODO: connect with API to get selected items and add to new message
                onAddToMessage={pushToMessages}
                // TODO: connect with API to get selected items and add to new post
                // eslint-disable-next-line no-console
                onAddToPost={() => console.log("add to post")}
              />
            </>
          )}
          <div className="mr-3">
            <VaultAddButton onClick={setFiles} />
          </div>
          <div>
            <SortDropdown
              selection={{
                orderType: order === "desc" ? "recent" : "oldest"
              }}
              options={sortOptions}
              onSelect={onSortSelect}
            />
          </div>
        </div>
      )}
    </div>
  )
}
