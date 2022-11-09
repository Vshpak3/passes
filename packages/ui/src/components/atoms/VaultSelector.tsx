import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import VaultIcon from "public/icons/messages-vault-icon.svg"
import { FC, useState } from "react"

import { VaultDialog } from "src/components/molecules/vault/VaultDialog"

interface VaultSelectorProps {
  expanded?: boolean
  selectVaultContent: (contents: ContentDto[]) => void | Promise<void>
  otherUserIsCreator?: boolean
}

export const VaultSelector: FC<VaultSelectorProps> = ({
  selectVaultContent,
  expanded,
  otherUserIsCreator
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <span
      className={classNames(
        isOpen || expanded ? " bg-[#FF51A8]/10 " : "hover:bg-[#FF51A8]/10",
        "group flex h-full flex-shrink-0 items-center rounded-[56px] px-1 text-sm leading-4 text-[#FF51A8] sm:px-4 sm:py-3 md:py-2 md:px-3"
      )}
      onClick={() => setIsOpen(true)}
    >
      <span className="flex shrink-0 cursor-pointer items-center gap-1">
        <VaultIcon className="flex shrink-0" />
        <span
          className={classNames(
            !otherUserIsCreator
              ? "block md:hidden md:group-hover:block"
              : isOpen || expanded
              ? "block"
              : "hidden group-hover:block",
            "block"
          )}
        >
          Vault
        </span>
      </span>
      {isOpen && (
        <VaultDialog
          closeVault={() => setIsOpen(false)}
          isOpen={isOpen}
          setContent={selectVaultContent}
        />
      )}
    </span>
  )
}
