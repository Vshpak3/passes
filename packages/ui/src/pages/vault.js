import { VaultGallery } from "src/components/organisms"
import useVaultGallery from "src/hooks/vault/useVaultGallery"
import { withPageLayout } from "src/layout/WithPageLayout"

import CreatorOnlyWrapper from "../components/wrappers/CreatorOnly"

const Vault = () => {
  const {
    mediaContent,
    filteredItems,
    selectedItems,
    setFilteredItems,
    setSelectedItems
  } = useVaultGallery()

  return (
    <CreatorOnlyWrapper isPage>
      <div className="-mt-[180px] grid w-full max-w-[1000px] grid-cols-1 justify-center px-4 sidebar-collapse:mx-auto">
        <VaultGallery
          filteredItems={filteredItems}
          mediaContent={mediaContent}
          selectedItems={selectedItems}
          setFilteredItems={setFilteredItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </CreatorOnlyWrapper>
  )
}

export default withPageLayout(Vault)
