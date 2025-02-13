import { ContentDto } from "@passes/api-client"
import LockedIcon from "public/icons/post-locked-icon.svg"
import UnlockedIcon from "public/icons/post-unlocked-icon.svg"
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
  const Icon = paid ? UnlockedIcon : LockedIcon
  return (
    <div className="mt-4 flex w-full items-center justify-center">
      <Button
        className="flex w-full rounded-[4px] border-2 border-passes-primary-color/50 bg-passes-pink-100/25 py-2 text-center text-base font-medium text-passes-primary-color shadow-sm"
        disabled={paying}
        icon={<Icon className="flex h-6 w-6" />}
        onClick={openBuyModal}
        variant={ButtonVariant.NONE}
      >
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
