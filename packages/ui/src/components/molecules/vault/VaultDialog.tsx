import { ContentDto } from "@passes/api-client"
import React, { FC, useState } from "react"

import { Dialog } from "src/components/organisms/Dialog"
import { Vault } from "src/components/pages/tools/Vault"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"

interface VaultDialogProps {
  isOpen: boolean
  closeVault: () => void
  setContent: (contents: ContentDto[]) => void
}
export const VaultDialog: FC<VaultDialogProps> = ({
  isOpen,
  closeVault,
  setContent
}) => {
  const [selectedItems, setSelectedItems] = useState<ContentDto[]>([])
  const pushToMessages = () => {
    setContent(selectedItems)
    closeVault()
  }
  return (
    <Dialog
      className="flex h-full flex-col items-center justify-center border border-[#ffffff]/10 bg-[#0c0609] px-[29px] py-5 transition-all md:rounded-[15px]"
      footer={
        <div className="relative h-full pt-5">
          <div className="flex flex-col items-start justify-start gap-3">
            <div className="flex w-full items-end justify-between gap-3">
              <button
                className="rounded-full bg-passes-secondary-color py-2 px-6"
                onClick={closeVault}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-passes-secondary-color py-2 px-6"
                onClick={pushToMessages}
                type="button"
              >
                Use selected media
              </button>
            </div>
          </div>
        </div>
      }
      onClose={closeVault}
      open={isOpen}
    >
      <AuthWrapper creatorOnly isPage>
        <div className="">
          <Vault passSelectedItems={setSelectedItems} />
        </div>
      </AuthWrapper>
    </Dialog>
  )
}
