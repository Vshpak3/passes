import {
  ContentApi,
  ContentDto,
  GetVaultQueryRequestDtoOrderEnum
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"
import { MdDelete } from "react-icons/md"

import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { VaultAddButton } from "src/components/molecules/vault/VaultAddButton"
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
    <div className="relative mt-[-175px] mb-[28px] flex w-full flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="text-[24px] font-bold text-white">Creator Vault</div>
      </div>
      <VaultFilterContainer
        setVaultCategory={setVaultCategory}
        setVaultType={setVaultType}
        vaultCategory={vaultCategory}
        vaultType={vaultType}
      />
      {deleteModalActive && (
        <DeleteConfirmationModal
          isOpen={deleteModalActive}
          onClose={() => setDeleteModalActive(false)}
          onDelete={handleVaultDeleteItems}
        />
      )}
      <VaultSelectContainer
        deselectAll={deselectAll}
        selectedItems={selectedItems}
      />
      {!embedded && (
        <div className="absolute right-20 bottom-0 flex">
          {selectedItems && selectedItems?.length > 0 && (
            <>
              <div>20 media files can be posted at a time</div>
              <div
                className="cursor-pointer px-2 text-white opacity-70 hover:opacity-100 md:px-3"
                onClick={() => setDeleteModalActive(true)}
              >
                <MdDelete size={23} />
              </div>
              {/*
              TODO: connect with API to get selected items and add to new
              TODO: connect with API to get selected items and add to new post
              <VaultAddToDropdown
                onAddToMessage={pushToMessages}
                onAddToPost={() => undefined}
              />
              */}
            </>
          )}
          <div className="mr-3">
            <VaultAddButton onClick={setFiles} />
          </div>
          <div>
            <SortDropdown
              onSelect={onSortSelect}
              options={sortOptions}
              selection={{
                orderType: order === "desc" ? "recent" : "oldest"
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
