import { Dispatch, SetStateAction } from "react"
import { VaultDeleteButton } from "src/components/atoms/vault"
import {
  VaultAddToDropdown,
  VaultDeleteModal,
  VaultFilterContainer,
  VaultMediaItem,
  VaultSelectContainer,
  VaultSortDropdown
} from "src/components/molecules"
import useVaultSort from "src/hooks/vault/useVaultSort"

import {
  TVaultCategory,
  TVaultData,
  TVaultType
} from "../../hooks/vault/useVaultGallery"

interface IVaultNavigation {
  selectedItems: Array<string>
  vaultContent: TVaultData
  setSelectedItems: Dispatch<SetStateAction<Array<string>>>
  fetchVaultType: (type: TVaultType) => void
  fetchVaultCategory: (category: TVaultCategory) => void
  vaultType: TVaultType
  vaultCategory: TVaultCategory
  newMessage: boolean
  setNewMessage: any
}
interface IVaultMediaGrid {
  selectedItems: Array<string>
  vaultContent: TVaultData
  setSelectedItems: Dispatch<SetStateAction<Array<string>>>
}

const VaultNavigation = ({
  selectedItems,
  vaultType,
  vaultCategory,
  fetchVaultType,
  fetchVaultCategory,
  vaultContent,
  setSelectedItems,
  newMessage,
  setNewMessage
}: IVaultNavigation) => {
  const selectAll = () =>
    setSelectedItems(vaultContent?.map((item) => item.contentId) ?? [])
  const deselectAll = () => setSelectedItems([])

  const {
    deleteModalActive,
    toggleDeleteModal,
    setDeleteModalActive,
    sortByOrderOptions,
    sortKey,
    sortKeyOptions,
    sortOrder
  } = useVaultSort()

  return (
    <div className="-mt-[180px] mb-[28px] flex w-full flex-col justify-between">
      <div className="align-items flex items-center justify-between">
        <div className="align-items text-[24px] font-bold text-white">
          Creator Vault
        </div>
        <div className="align-center items-align flex justify-center">
          {selectedItems && selectedItems?.length > 0 && (
            <>
              <VaultDeleteButton toggleDeleteModal={toggleDeleteModal} />
              <VaultAddToDropdown
                // TODO: connect with API to get selected items and add to new message
                onAddToMessage={() => setNewMessage(!newMessage)}
                // TODO: connect with API to get selected items and add to new post
                onAddToPost={() => console.log("add to post")}
              />
            </>
          )}
          <VaultSortDropdown
            sortKey={sortKey}
            sortOrder={sortOrder}
            sortByOrderOptions={sortByOrderOptions}
            sortKeyOptions={sortKeyOptions}
          />
        </div>
      </div>
      <VaultSelectContainer
        selectedItems={selectedItems}
        deselectAll={deselectAll}
        selectAll={selectAll}
      />
      <VaultFilterContainer
        vaultType={vaultType}
        vaultCategory={vaultCategory}
        fetchVaultType={fetchVaultType}
        fetchVaultCategory={fetchVaultCategory}
      />
      <VaultDeleteModal
        toggleDeleteModal={toggleDeleteModal}
        deleteModalActive={deleteModalActive}
        // TODO: connect with API to get selected items and delete items
        onDeleteVaultItems={() => console.log("delete items")}
        setDeleteModalActive={setDeleteModalActive}
      />
    </div>
  )
}
const composeEmptyGrid = () => (
  <div key={Math.random()} className="col-span-1 w-[115px] md:w-[320px]" />
)
const VaultMediaGrid = ({
  selectedItems,
  setSelectedItems,
  vaultContent
}: IVaultMediaGrid) => {
  const emptyGrid = new Array(3).fill(0).map(composeEmptyGrid)
  const mediaGrid = vaultContent?.map((item) => (
    <VaultMediaItem
      key={item.contentId}
      itemData={item}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
    />
  ))

  return (
    <div className="max-h-[65vh] justify-center overflow-y-scroll">
      <div className="grid grid-cols-3 gap-2">
        {vaultContent && vaultContent.length > 0 ? mediaGrid : emptyGrid}
      </div>
    </div>
  )
}

export { VaultMediaGrid, VaultNavigation }
