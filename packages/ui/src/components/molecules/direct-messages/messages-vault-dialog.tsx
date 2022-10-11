import React, { Dispatch, FC, SetStateAction } from "react"
import { Dialog } from "src/components/organisms/Dialog"
import {
  VaultMediaGrid,
  VaultNavigation
} from "src/components/organisms/VaultSections"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"
import { useVaultGallery } from "src/hooks/vault/useVaultGallery"

interface MessagesVaultDialogProps {
  hasVault: boolean
  setHasVault: Dispatch<SetStateAction<any>>
  setContentIds: Dispatch<SetStateAction<any>>
}
export const MessagesVaultDialog: FC<MessagesVaultDialogProps> = ({
  hasVault,
  setHasVault,
  setContentIds
}) => {
  const {
    vaultType,
    vaultCategory,
    vaultContent,
    fetchVaultType,
    fetchVaultCategory,
    selectedItems,
    setSelectedItems
  } = useVaultGallery()
  const pushToMessages = () => {
    setContentIds(selectedItems)
    setHasVault(false)
  }
  return (
    <Dialog
      className="flex h-[90vh] w-screen transform flex-col items-center justify-center border border-[#ffffff]/10 bg-[#0c0609] px-[29px] py-5 transition-all md:max-w-[544px] md:rounded-[20px]"
      open={hasVault}
      title={
        <div className="mt-[180px]">
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
        </div>
      }
      footer={
        <div className="relative h-full pt-5">
          <div className="flex flex-col items-start justify-start gap-3">
            <div className="flex w-full items-end justify-between gap-3">
              <button
                className="rounded-full bg-passes-secondary-color py-2 px-6"
                type="button"
                onClick={() => setHasVault(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-passes-secondary-color py-2 px-6"
                type="button"
                onClick={() => pushToMessages()}
              >
                Use selected media
              </button>
            </div>
          </div>
        </div>
      }
    >
      <AuthWrapper isPage creatorOnly={true}>
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
            fromMessages={true}
          />

          <VaultMediaGrid
            vaultContent={vaultContent}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
      </AuthWrapper>
    </Dialog>
  )
}
