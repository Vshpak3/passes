import { ContentDto } from "@passes/api-client"
import LockLockIcon from "public/icons/post-locked-icon.svg"
import UnlockLockIcon from "public/icons/post-unlocked-icon.svg"
import { FC } from "react"

import { Button, ButtonVariant } from "src/components/atoms/button/Button"
import { UnlockText } from "src/components/organisms/UnlockText"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { formatCurrency } from "src/helpers/formatters"

interface ContentLockButtonProps {
  contents: ContentDto[]
  price: number
  previewIndex: number
  paying: boolean
  paid: boolean
  openBuyModal?: () => void
}

export const ContentLockButton: FC<ContentLockButtonProps> = ({
  contents,
  price,
  previewIndex,
  paying,
  paid,
  openBuyModal
}) => {
  const { images, video } = contentTypeCounter(contents.slice(previewIndex))
  const Icon = paid ? LockLockIcon : UnlockLockIcon
  return (
    <div className="mt-4 flex w-full items-center justify-center">
      <Button
        className="flex w-full rounded-[4px] border-2 border-passes-primary-color/50 bg-[#B52A6F]/25 py-2 text-center text-base font-medium text-passes-primary-color shadow-sm"
        disabled={paying}
        onClick={openBuyModal}
        variant={ButtonVariant.NONE}
      >
        <Icon className="mr-2 flex h-6 w-6" />
        {paid ? (
          "Post unlocked!"
        ) : paying ? (
          "Paying..."
        ) : (
          <>
            <UnlockText images={images} videos={video} /> for{" "}
            {formatCurrency(price)}
          </>
        )}
      </Button>
    </div>
  )
}
