// eslint-disable-next-line import/no-unresolved
import "swiper/css/lazy"
// eslint-disable-next-line import/no-unresolved
import "swiper/css"
import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, ForwardedRef, forwardRef, useState } from "react"

import { ContentService } from "src/helpers/content"

export interface SlideImageProps {
  content: ContentDto
  ref: ForwardedRef<HTMLImageElement>
}

export const SlideImage: FC<SlideImageProps> = forwardRef(
  ({ content }: SlideImageProps, ref: ForwardedRef<HTMLImageElement>) => {
    const [loaded, setLoaded] = useState(false)
    const image = ContentService.userContentMediaPath(content)
    return (
      <div className="relative mt-4 max-h-[1200px] cursor-pointer">
        <div className="relative h-full overflow-hidden bg-black">
          {loaded && (
            <div
              style={{ backgroundImage: `url(${image})` }}
              className={classNames(
                "absolute inset-0 inset-x-4 z-10 h-auto max-h-[800px] bg-cover bg-center [filter:blur(10px)opacity(80%)]"
              )}
            />
          )}

          <img
            ref={ref}
            onLoad={() => setLoaded(true)}
            key={content.contentId}
            data-src={image}
            alt=""
            // height={400}
            // width={650}
            className=" relative z-20 inline-block h-auto max-w-full object-contain"
          />
          {/* <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div> */}
        </div>
      </div>
    )
  }
)

SlideImage.displayName = "PostImage"
