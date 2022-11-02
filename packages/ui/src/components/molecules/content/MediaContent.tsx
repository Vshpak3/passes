import { FC } from "react"

import {
  ContentCarousel,
  ContentCarouselProps
} from "src/components/organisms/content/ContentCarousel"

interface MediaContentProps extends ContentCarouselProps {
  isProcessing: boolean
}

export const MediaContent: FC<MediaContentProps> = ({
  isProcessing,
  ...res
}) => {
  return (
    <div className="relative flex w-full items-center justify-center bg-transparent">
      {isProcessing ? (
        <div className="relative rounded-md border border-passes-purple-100 px-[25px] py-[15px]">
          This content is being processed.
        </div>
      ) : (
        <div className="relative mt-3 flex w-full items-center justify-center bg-transparent">
          <div className="relative w-[100%]">
            <ContentCarousel {...res} />
          </div>
        </div>
      )}
    </div>
  )
}
