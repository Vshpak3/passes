import { ContentDto } from "@passes/api-client"
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
}

export const LockedMedia: FC<LockedMediaProps> = ({
  contents,
  price,
  previewIndex,
  paying,
  openBuyModal
}) => {
  const { images, video } = contentTypeCounter(contents.slice(previewIndex))

  // const showcaseImg = useMemo(() => {
  //   if (contents?.[0]?.contentType === "image") {
  //     return ContentService.userContentMediaPath(contents[0])
  //   }
  // }, [contents])

  return (
    <div className="relative mt-3 min-h-[200px] p-16">
      {/* {showcaseImg && (
        <div className="[filter:blur(15px)]">
          <img
            src={showcaseImg}
            alt="post"
            className="object-cover object-center"
          />
        </div>
      )} */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-[35px] rounded-[15px] border border-white/20 bg-[rgba(27,20,29,0.5)] py-[25px] px-[34px] backdrop-blur-[50px]">
        <ContentUnlockButton
          className="w-auto !px-[30px] !py-2.5"
          isDisabled={paying}
          name={
            paying ? "Paying..." : `Unlock For ${formatCurrency(price ?? 0)}`
          }
          onClick={openBuyModal} // onClick={() => setPost(post)}
        />
        <p className="mt-[17px] text-base font-medium">
          <span>
            Unlock {video ? `${plural("video", video)},` : ""}{" "}
            {plural("photo", images)}!
          </span>
        </p>
      </div>
    </div>
  )
}
