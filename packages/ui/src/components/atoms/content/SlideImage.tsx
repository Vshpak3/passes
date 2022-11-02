// eslint-disable-next-line import/no-unresolved
import "swiper/css/lazy"
// eslint-disable-next-line import/no-unresolved
import "swiper/css"
import { ContentDto } from "@passes/api-client"
import { FC, ForwardedRef, forwardRef } from "react"

import { ContentService } from "src/helpers/content"

export interface SlideImageProps {
  content: ContentDto
  ref: ForwardedRef<HTMLImageElement>
}

export const SlideImage: FC<SlideImageProps> = forwardRef(
  ({ content }: SlideImageProps, ref: ForwardedRef<HTMLImageElement>) => {
    const image = ContentService.userContentMediaPath(content)
    return (
      <div className="relative mt-4 max-h-[1200px] cursor-pointer">
        <div className="relative h-full overflow-hidden bg-black">
          <img
            ref={ref}
            // onLoad={() => setLoaded(true)}
            key={content.contentId}
            src={image}
            alt=""
            className=" relative z-20 inline-block h-auto max-w-full object-contain"
          />
          {/* <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div> */}
        </div>
      </div>
    )
  }
)

SlideImage.displayName = "PostImage"
