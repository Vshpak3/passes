// eslint-disable-next-line import/no-unresolved
import "swiper/css/lazy"
// eslint-disable-next-line import/no-unresolved
import "swiper/css"

import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, ForwardedRef, forwardRef } from "react"
import { ContentService } from "src/helpers/content"

export interface PostImageProps {
  content: ContentDto
  onMediaLoad?: () => () => void
  ref: ForwardedRef<HTMLImageElement>
}

export const PostImage: FC<PostImageProps> = forwardRef(
  ({ content, onMediaLoad }, ref: ForwardedRef<HTMLImageElement>) => {
    const imageThumbnail = `bg-[url('${ContentService.userContentMediaPath(
      content
    )}')]`
    return (
      <>
        <div
          className={classNames(
            imageThumbnail,
            "absolute inset-0 inset-x-4 z-10 bg-cover bg-center [filter:blur(10px)opacity(80%)]"
          )}
        />
        <img
          ref={ref}
          onLoad={onMediaLoad}
          key={content.contentId}
          data-src={ContentService.userContentMediaPath(content)}
          alt=""
          height={400}
          width={650}
          className="swiper-lazy relative z-20 inline-block h-[400px] w-full select-none rounded-[15px] object-contain"
        />
        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
      </>
    )
  }
)

PostImage.displayName = "PostImage"
