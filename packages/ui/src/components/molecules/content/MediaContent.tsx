import { FC, memo } from "react"

import {
  ContentCarousel,
  ContentCarouselProps
} from "src/components/organisms/content/ContentCarousel"

interface MediaContentProps extends ContentCarouselProps {
  isProcessing: boolean
  key: string
}

const MediaContentUnmemo: FC<MediaContentProps> = ({
  isProcessing,
  key,
  ...res
}) => {
  return (
    <div className="relative flex w-full items-center justify-center bg-transparent">
      {isProcessing ? (
        <div className="relative rounded-md border border-passes-purple-100 px-[25px] py-[15px]">
          This content is being processed.
        </div>
      ) : (
        <div className="relative flex w-full items-center justify-center bg-transparent">
          <div className="relative w-[100%]">
            <ContentCarousel key={key} {...res} />
          </div>
        </div>
      )}
    </div>
  )
}
export const MediaContent = memo(MediaContentUnmemo)
