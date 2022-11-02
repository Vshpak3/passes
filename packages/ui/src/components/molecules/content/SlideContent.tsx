import { ContentDto, ContentDtoContentTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import { FC, ForwardedRef, forwardRef, useEffect, useState } from "react"

import {
  SlideImage,
  SlideImageProps
} from "src/components/atoms/content/SlideImage"
import { MediaModal } from "src/components/organisms/MediaModal"
import { ContentService } from "src/helpers/content"

interface SlideContentProps extends SlideImageProps {
  ref: ForwardedRef<HTMLImageElement>
  autoplayVideo?: boolean
  carouselContent?: ContentDto[]
  index?: number
  fixedHeight: boolean
}

export const SlideContent: FC<SlideContentProps> = forwardRef(
  (
    { content, carouselContent, index = 0, fixedHeight }: SlideContentProps,
    ref: ForwardedRef<HTMLImageElement>
  ) => {
    const [openModal, setOpenModal] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
      if (openModal) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
      return () => {
        document.body.style.overflow = ""
      }
    }, [openModal])

    const onImgClickHandler = () => {
      setOpenModal(true)
      setActiveIndex(index)
    }

    switch (content.contentType) {
      case ContentDtoContentTypeEnum.Image:
        return (
          <>
            <button
              className={classNames(
                fixedHeight ? "max-h-[85vh]" : "",
                "h-full w-full"
              )}
              onClick={onImgClickHandler}
            >
              <SlideImage content={content} ref={ref} />
            </button>
            {openModal && (
              <MediaModal
                isOpen={openModal}
                setOpen={setOpenModal}
                file={{ content }}
                modalContainerClassname="p-0"
                childrenClassname="p-0"
                carouselContent={carouselContent}
                activeIndex={activeIndex}
              />
            )}
          </>
        )
      case ContentDtoContentTypeEnum.Video:
        return (
          <div data-vjs-player>
            <video
              src={ContentService.userContentMediaPath(content)}
              className="video-js vjs-big-play-centered"
            />
          </div>
        )
    }
    return null
  }
)

SlideContent.displayName = "PostContent"
