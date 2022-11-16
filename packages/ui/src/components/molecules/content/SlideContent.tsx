import { ContentDto, ContentDtoContentTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import { forwardRef, useEffect, useState } from "react"

import {
  SlideImage,
  SlideImageProps
} from "src/components/atoms/content/SlideImage"
import { VideoContent } from "src/components/atoms/content/VideoContent"
import { MediaModal } from "src/components/organisms/MediaModal"

interface SlideContentProps extends SlideImageProps {
  autoplayVideo?: boolean
  carouselContent?: ContentDto[]
  index: number
  fixedHeight: boolean
  isActive: boolean
  messagesView?: boolean
}

export const SlideContent = forwardRef<HTMLImageElement, SlideContentProps>(
  (
    {
      content,
      carouselContent,
      index,
      fixedHeight,
      isActive,
      autoplayVideo,
      messagesView
    },
    ref
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
                fixedHeight ? "max-h-[75vh]" : "",
                messagesView && fixedHeight
                  ? "max-h-[400px]"
                  : fixedHeight
                  ? "max-h-[55vh] sm:max-h-[75vh]"
                  : "",
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
          <VideoContent
            autoplay={autoplayVideo}
            content={content}
            fixedHeight={fixedHeight}
            isActive={isActive}
            messagesView={messagesView}
          />
        )
    }
    return null
  }
)

SlideContent.displayName = "PostContent"
