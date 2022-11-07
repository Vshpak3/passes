import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { FC } from "react"

import { ContentUnlockButton } from "src/components/atoms/Button"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { formatCurrency } from "src/helpers/formatters"
import { plural } from "src/helpers/plural"

interface LockedMediaProps {
  contents: ContentDto[]
  price: number
  previewIndex: number
  paying: boolean
  openBuyModal: () => void
  fixedHeight?: boolean
}

export const LockedMedia: FC<LockedMediaProps> = ({
  contents,
  price,
  previewIndex,
  paying,
  openBuyModal,
  fixedHeight
}) => {
  const { images, video } = contentTypeCounter(contents.slice(previewIndex))

  return (
    <div
      className={classNames(fixedHeight ? "max-h-[75vh]" : "", "h-full w-full")}
    >
      <div className="relative h-full max-h-[1200px] cursor-pointer">
        <div className="relative h-full overflow-hidden">
          <div>
            <img
              alt="post"
              className="object-cover object-center"
              src="/img/PricedContentPlaceholder.png"
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
            <p className="text-base font-medium">
              <span>
                Unlock {video ? `${plural("video", video)},` : ""}{" "}
                {plural("photo", images)}!
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
