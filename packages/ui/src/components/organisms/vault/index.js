import { VaultDeleteButton } from "src/components/atoms/vault"
import {
  VaultAddToDropdown,
  VaultDeleteModal,
  VaultFilterContainer,
  VaultMediaItem,
  VaultSelectContainer,
  VaultSortDropdown
} from "src/components/molecules"
import useVaultSort from "src/hooks/useVaultSort"

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
    <div className="mx-2 flex-col justify-between px-1 md:mb-8">
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
    <div className=" mt-3 max-h-[62vh] min-w-[320px] max-w-[653px] overflow-y-auto md:min-w-[650px] sidebar-collapse:min-w-[1000px]">
      <div className="align-center flex items-center justify-center px-2 md:px-0">
        <div className="grid grid-cols-3 items-center gap-4 md:grid-cols-2 md:gap-4 sidebar-collapse:grid-cols-3">
          {filteredItems.length > 0 ? mediaGrid : emptyGrid}
        </div>
      </div>
    </div>
  )
}

export { VaultMediaGrid, VaultNavigation }
