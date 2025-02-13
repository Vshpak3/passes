import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { FC } from "react"

import { ContentUnlockButton } from "src/components/atoms/button/ContentUnlockButton"
import { UnlockText } from "src/components/organisms/UnlockText"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { formatCurrency } from "src/helpers/formatters"

interface LockedMediaProps {
  contents: ContentDto[]
  price: number
  previewIndex: number
  paying: boolean
  openBuyModal: () => void
  fixedHeight?: boolean
  messagesView?: boolean
}

export const LockedMedia: FC<LockedMediaProps> = ({
  contents,
  price,
  previewIndex,
  paying,
  openBuyModal,
  fixedHeight,
  messagesView
}) => {
  const { images, video } = contentTypeCounter(contents.slice(previewIndex))

  return (
    <div
      className={classNames(
        messagesView && fixedHeight
          ? "max-h-[400px] min-h-[250px]"
          : fixedHeight
          ? "max-h-[55vh] sm:max-h-[75vh]"
          : "",
        "h-full w-full"
      )}
    >
      <div className="relative h-full max-h-[1200px] cursor-pointer">
        <div className="relative h-full overflow-hidden">
          <div>
            <img
              alt="post"
              className="h-full w-full object-cover object-center"
              src="/img/locked-media.png"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[10px] bg-[rgba(27,20,29,0.5)] py-[25px] px-[34px] backdrop-blur-[50px]">
            <ContentUnlockButton
              className="w-auto !px-[15px] !py-1.5 md:!px-[30px] md:!py-2.5"
              isDisabled={paying}
              name={
                paying
                  ? "Paying..."
                  : `Unlock For ${formatCurrency(price ?? 0)}`
              }
              onClick={openBuyModal}
            />
            <span className="text-base font-medium">
              <UnlockText images={images} videos={video} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
