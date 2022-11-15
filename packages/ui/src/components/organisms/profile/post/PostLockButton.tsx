import UnlockLockIcon from "public/icons/profile-unlock-lock-icon.svg"
import { FC } from "react"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"

interface PostLockButtonProps {
  paying: boolean
  paid: boolean
  openBuyModal: () => void
}

export const PostLockButton: FC<PostLockButtonProps> = ({
  paying,
  paid,
  openBuyModal
}) => {
  // TODO ADD NEW ICON + DESIGN CHANGES
  // eslint-disable-next-line sonarjs/no-all-duplicated-branches
  const Icon = paid ? UnlockLockIcon : UnlockLockIcon
  return (
    <div className="flex w-full items-center justify-center px-5">
      <Button
        className="flex w-full rounded-[5px] border-none py-2 text-center text-base font-medium text-white shadow-sm"
        disabled={paying}
        onClick={openBuyModal}
        variant={ButtonVariant.GRADIENT}
      >
        <Icon className="mr-2 flex h-6 w-6" />
        {paid ? "Post unlocked!" : paying ? "Paying..." : "Unlock all content"}
      </Button>
    </div>
  )
}
