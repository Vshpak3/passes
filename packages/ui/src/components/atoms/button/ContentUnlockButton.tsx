import classNames from "classnames"
import UnlockLockIcon from "public/icons/profile-unlock-lock-icon.svg"
import { FC } from "react"

import { Button } from "./Button"

interface ContentUnlockButtonProps {
  name: string
  onClick: () => void
  className?: string
  isDisabled?: boolean
}

export const ContentUnlockButton: FC<ContentUnlockButtonProps> = ({
  name,
  onClick,
  className = "",
  isDisabled = false
}) => (
  <Button
    className={classNames(
      className,
      "flex w-full items-center justify-center gap-[10px] rounded-[5px] border-none bg-passes-pink-100 py-[9px] text-base font-medium text-white shadow-sm"
    )}
    disabled={isDisabled}
    icon={<UnlockLockIcon className="flex h-6 w-6" />}
    onClick={onClick}
  >
    {name}
  </Button>
)
