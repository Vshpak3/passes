import { ContentDto } from "@passes/api-client"
import React, { FC, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
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
      className="flex h-[90vh] flex-col items-center justify-center border border-white/10 bg-[#0c0609] px-[29px] py-5 transition-all md:rounded-[15px]"
      footer={
        <div className="relative h-full pt-5">
          <div className="flex h-full flex-col items-start justify-start gap-3">
            <div className="flex w-full items-end justify-between gap-3">
              <Button onClick={closeVault}>Cancel</Button>
              <Button onClick={pushToMessages}>Use selected media</Button>
            </div>
          </div>
        </div>
      }
      innerScroll
      onClose={closeVault}
      open={isOpen}
    >
      <AuthWrapper creatorOnly isPage>
        <Vault passSelectedItems={setSelectedItems} scroll />
      </AuthWrapper>
    </Dialog>
  )
}
