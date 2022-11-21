// eslint-disable-next-line import/no-unresolved
import "swiper/css"
import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { forwardRef, useState } from "react"

import { ContentService } from "src/helpers/content"

export interface SlideImageProps {
  content: ContentDto
}

export const SlideImage = forwardRef<HTMLImageElement, SlideImageProps>(
  ({ content }, ref) => {
    const [loaded, setLoaded] = useState(false)
    const image = ContentService.userContentMediaPath(content)
    return (
      <>
        {loaded && (
          <div
            className={classNames(
              "absolute inset-0 inset-x-4 z-10 h-auto  bg-cover bg-center [filter:blur(10px)opacity(80%)]"
            )}
            style={{ backgroundImage: `url(${image})` }}
          />
        )}

        <img
          alt=""
          className="relative z-20 inline-block h-auto max-h-full max-w-full object-contain"
          key={content.contentId}
          onLoad={() => setLoaded(true)}
          ref={ref}
          src={image}
        />
      </>
    )
  }
)

SlideImage.displayName = "PostImage"
