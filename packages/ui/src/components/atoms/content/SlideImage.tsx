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
      <div className="relative h-full max-h-[1200px] cursor-pointer">
        <div className="relative h-full overflow-hidden">
          {loaded && (
            <div
              className={classNames(
                "absolute inset-0 inset-x-4 z-10 h-auto max-h-[800px] bg-cover bg-center [filter:blur(10px)opacity(80%)]"
              )}
              style={{ backgroundImage: `url(${image})` }}
            />
          )}

          <img
            alt=""
            className="relative top-[50%] z-20 inline-block h-auto max-h-full max-w-full translate-y-[-50%] object-contain"
            key={content.contentId}
            onLoad={() => setLoaded(true)}
            ref={ref}
            src={image}
          />
        </div>
      </div>
    )
  }
)

SlideImage.displayName = "PostImage"
