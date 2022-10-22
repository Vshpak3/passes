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
    <span
      className={classNames(
        isOpen || expanded
          ? " bg-[rgba(191,122,240,0.1)] "
          : "hover:bg-[rgba(191,122,240,0.1)]",
        "group flex h-full flex-shrink-0 items-center rounded-[56px] py-2 px-3 text-sm leading-4 text-passes-secondary-color sm:px-4 sm:py-3"
      )}
      onClick={() => setIsOpen(true)}
    >
      <span className="flex flex-shrink-0 cursor-pointer items-center gap-1">
        <VaultIcon className="flex flex-shrink-0" />
        <span
          className={classNames(
            isOpen || expanded ? "block" : "hidden group-hover:block",
            "block"
          )}
        >
          Vault
        </span>
      </span>
      {isOpen && (
        <VaultDialog
          isOpen={isOpen}
          closeVault={() => setIsOpen(false)}
          setContent={selectVaultContent}
        />
      )}
    </span>
  )
}
