// eslint-disable-next-line import/no-unresolved
import "swiper/css/lazy"
// eslint-disable-next-line import/no-unresolved
import "swiper/css"

import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { FC, ForwardedRef, forwardRef, useState } from "react"
import { ContentService } from "src/helpers/content"

export interface PostImageProps {
  content: ContentDto
  ref: ForwardedRef<HTMLImageElement>
}

export const PostImage: FC<PostImageProps> = forwardRef(
  ({ content }: PostImageProps, ref: ForwardedRef<HTMLImageElement>) => {
    const [loaded, setLoaded] = useState(false)
    const image = ContentService.userContentMediaPath(content)
    return (
      <>
        {loaded && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className={classNames(
              "absolute inset-0 inset-x-4 z-10 h-[400px] bg-cover bg-center [filter:blur(10px)opacity(80%)]"
            )}
          />
        )}
        <img
          ref={ref}
          onLoad={() => setLoaded(true)}
          key={content.contentId}
          data-src={image}
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
