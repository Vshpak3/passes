import {
  ContentApi,
  ContentDto,
  GetVaultQueryRequestDtoOrderEnum
} from "@passes/api-client"
import { useRouter } from "next/router"
import ExitIcon from "public/icons/exit-icon.svg"
import { FC, useCallback, useState } from "react"
import { MdDelete } from "react-icons/md"
import { toast } from "react-toastify"

import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
import { VaultAddButton } from "src/components/molecules/vault/VaultAddButton"
import { VaultAddToDropdown } from "src/components/molecules/vault/VaultAddTo"
import { VaultFilterContainer } from "src/components/molecules/vault/VaultFilter"
import {
  SortDropdown,
  SortOption
} from "src/components/organisms/creator-tools/lists/SortDropdown"
import { VaultCategory, VaultType } from "src/components/pages/tools/Vault"
import { plural } from "src/helpers/plural"

type OrderType = "recent" | "oldest"

const sortOptions: SortOption<OrderType>[] = [
  { orderType: "recent" },
  { orderType: "oldest" }
]

interface VaultNavigationProps {
  selectedItems: ContentDto[]
  addNewMedia: (newFilew: FileList | null) => void
  setSelectedItems: (items: ContentDto[]) => void
  setVaultType: (type: VaultType) => void
  setVaultCategory: (category: VaultCategory) => void
  setOrder: (order: GetVaultQueryRequestDtoOrderEnum) => void
  vaultType: VaultType
  vaultCategory: VaultCategory
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
  order,
  deletedItems,
  setDeletedItems,
  addNewMedia,
  embedded = false
}) => {
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

  const createNewPost = () => {
    // TODO: connect with API to get selected items and add to new post
    toast.error("Feature not yet supported")
  }

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
    <div className="relative mt-4 flex w-full flex-col justify-between border-b border-passes-dark-gray pb-6">
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
      {!embedded && (
        <div className="absolute right-20 bottom-5 flex">
          {selectedItems && selectedItems?.length > 0 && (
            <>
              <div className="flex flex-col">
                <div className="flex flex-row">
                  <div
                    className="h-[18px] w-[18px] cursor-pointer justify-center text-[#000000]"
                    onClick={deselectAll}
                  >
                    <ExitIcon />
                  </div>
                  <div className="font-semibold text-white">
                    {plural("item", selectedItems?.length)} selected
                  </div>
                </div>
                <div>20 media files can be posted at a time</div>
              </div>
              <div
                className="cursor-pointer px-2 text-white opacity-70 hover:opacity-100 md:px-3"
                onClick={() => setDeleteModalActive(true)}
              >
                <MdDelete size={23} />
              </div>
              <VaultAddToDropdown
                onAddToMessage={pushToMessages}
                onAddToPost={createNewPost}
              />
            </>
          )}
          <div className="mr-3">
            <VaultAddButton onClick={addNewMedia} />
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
