import { VaultMediaGrid, VaultNavigation } from "src/components/molecules"

const VaultGallery = ({
  mediaContent,
  filteredItems,
  selectedItems,
  setFilteredItems,
  setSelectedItems
}) => {
  return (
    <>
      <VaultNavigation
        filteredItems={filteredItems}
        mediaContent={mediaContent}
        selectedItems={selectedItems}
        setFilteredItems={setFilteredItems}
        setSelectedItems={setSelectedItems}
      />
      <VaultMediaGrid
        filteredItems={filteredItems}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </>
  )
}

export default VaultGallery
