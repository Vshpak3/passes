import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import VaultIcon from "public/icons/messages-vault-icon.svg"
import { FC, useState } from "react"

import { VaultDialog } from "src/components/molecules/vault/VaultDialog"

interface VaultSelectorProps {
  expanded?: boolean
  selectVaultContent: (contents: ContentDto[]) => void | Promise<void>
}

export const VaultSelector: FC<VaultSelectorProps> = ({
  selectVaultContent,
  expanded
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <button
      className={classNames(
        isOpen || expanded
          ? "bg-passes-primary-color/10"
          : "hover:bg-passes-primary-color/10",
        "group flex h-full flex-shrink-0 items-center rounded-[56px] text-sm leading-4 text-passes-primary-color sm:px-4 sm:py-3"
      )}
      onClick={() => setIsOpen(true)}
      type="button"
    >
      <span className="flex shrink-0 cursor-pointer items-center gap-1">
        <VaultIcon className="flex shrink-0" />
        <span
          className={classNames(
            isOpen || expanded ? "md:block" : "hidden md:group-hover:block"
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
    </button>
  )
}
