import { ContentDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction, useState } from "react"
import { Dialog } from "src/components/organisms/Dialog"
import { Vault } from "src/components/pages/tools/Vault"
import { AuthWrapper } from "src/components/wrappers/AuthWrapper"

interface MessagesVaultDialogProps {
  hasVault: boolean
  setHasVault: Dispatch<SetStateAction<any>>
  setContent: (contents: ContentDto[]) => void
}
export const MessagesVaultDialog: FC<MessagesVaultDialogProps> = ({
  hasVault,
  setHasVault,
  setContent
}) => {
  const [selectedItems, setSelectedItems] = useState<ContentDto[]>([])
  const pushToMessages = () => {
    setContent(selectedItems)
    setHasVault(false)
  }
  return (
    <Dialog
      className="flex h-full w-screen transform flex-col items-center justify-center border border-[#ffffff]/10 bg-[#0c0609] px-[29px] py-5 transition-all  md:rounded-[20px]"
      open={hasVault}
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
        <div className="">
          <Vault passSelectedItems={setSelectedItems} />
        </div>
      </AuthWrapper>
    </Dialog>
  )
}
