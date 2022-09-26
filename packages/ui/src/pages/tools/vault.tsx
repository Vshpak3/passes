import { useRouter } from "next/router"
import { VaultMediaGrid, VaultNavigation } from "src/components/organisms"
import CreatorOnlyWrapper from "src/components/wrappers/CreatorOnly"
import useVaultGallery from "src/hooks/vault/useVaultGallery"
import { withPageLayout } from "src/layout/WithPageLayout"

const Vault = () => {
  const {
    vaultType,
    vaultCategory,
    vaultContent,
    fetchVaultType,
    fetchVaultCategory,
    selectedItems,
    setSelectedItems
  } = useVaultGallery()

  const router = useRouter()
  const pushToMessages = () => {
    router.push(
      {
        pathname: "/messages",
        query: {
          contentIds: selectedItems
        }
      },
      "/messages"
    )
  }
  return (
    <CreatorOnlyWrapper isPage>
      <div className="mx-auto w-full px-2 md:px-5 sidebar-collapse:max-w-[1100px]">
        <VaultNavigation
          vaultContent={vaultContent}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          vaultType={vaultType}
          vaultCategory={vaultCategory}
          fetchVaultType={fetchVaultType}
          fetchVaultCategory={fetchVaultCategory}
          pushToMessages={pushToMessages}
        />

        <VaultMediaGrid
          vaultContent={vaultContent}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
    </CreatorOnlyWrapper>
  )
}

export default withPageLayout(Vault)
