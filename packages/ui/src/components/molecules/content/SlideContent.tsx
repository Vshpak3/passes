import { ContentDto, ContentDtoContentTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import { ForwardedRef, forwardRef, useEffect, useState } from "react"

import {
  SlideImage,
  SlideImageProps
} from "src/components/atoms/content/SlideImage"
import { MediaModal } from "src/components/organisms/MediaModal"
import { ContentService } from "src/helpers/content"

interface SlideContentProps extends SlideImageProps {
  // eslint-disable-next-line react/no-unused-prop-types
  autoplayVideo?: boolean
  carouselContent?: ContentDto[]
  index?: number
  fixedHeight: boolean
}

export const SlideContent = forwardRef(
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
                activeIndex={activeIndex}
                carouselContent={carouselContent}
                childrenClassname="p-0"
                file={{ content }}
                isOpen={openModal}
                modalContainerClassname="p-0"
                setOpen={setOpenModal}
              />
            )}
          </>
        )
      case ContentDtoContentTypeEnum.Video:
        return (
          <div data-vjs-player>
            <video
              className="video-js vjs-big-play-centered"
              src={ContentService.userContentMediaPath(content)}
            />
          </div>
        )
    }
    return null
  }
)

SlideContent.displayName = "PostContent"
