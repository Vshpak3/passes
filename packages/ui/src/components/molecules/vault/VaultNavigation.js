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

const VaultNavigation = ({
  selectedItems,
  filteredItems,
  mediaContent,
  setFilteredItems,
  setSelectedItems
}) => {
  const selectAll = () => setSelectedItems(filteredItems)
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
    <div className="flex-col justify-between">
      <div className="align-items flex items-center justify-between">
        <div className="align-items text-[24px] font-bold text-white">
          Creator Vault
        </div>
        <div className="align-center items-align flex justify-center">
          {selectedItems.length > 0 && (
            <>
              <VaultDeleteButton toggleDeleteModal={toggleDeleteModal} />
              <VaultAddToDropdown
                // TODO: connect with API to get selected items and add to new message
                onAddToMessage={() => console.log("add to msg")}
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
        sortKey={sortKey}
        sortOrder={sortOrder}
        filteredItems={filteredItems}
        mediaContent={mediaContent}
        setFilteredItems={setFilteredItems}
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
const VaultMediaGrid = ({ selectedItems, setSelectedItems, filteredItems }) => {
  const emptyGrid = new Array(3).fill().map(composeEmptyGrid)
  const mediaGrid = filteredItems?.map((item) => (
    <VaultMediaItem
      key={item.id}
      itemData={item}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
    />
  ))

  return (
    <div className="mt-[30px] max-h-[530px] justify-center overflow-y-scroll md:max-h-[590px] sidebar-collapse:mt-[30px] sidebar-collapse:max-w-[1000px]">
      <div className="grid grid-cols-3 gap-2">
        {filteredItems.length > 0 ? mediaGrid : emptyGrid}
      </div>
    </div>
  )
}

export { VaultMediaGrid, VaultNavigation }
