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

    let media: JSX.Element | undefined = undefined
    switch (content.contentType) {
      case ContentDtoContentTypeEnum.Image:
        media = (
          <>
            <button className="h-full w-full" onClick={onImgClickHandler}>
              <SlideImage content={content} ref={ref} />
            </button>
            {openModal && (
              <MediaModal
                activeIndex={activeIndex}
                carouselContent={carouselContent}
                file={{ content }}
                isOpen={openModal}
                modalContainerClassname="p-0"
                setOpen={setOpenModal}
              />
            )}
          </>
        )
        break
      case ContentDtoContentTypeEnum.Video:
        media = (
          <VideoContent
            autoplay={autoplayVideo}
            content={{ content }}
            isActive={isActive}
          />
        )
    }
    return (
      <div
        className={classNames(
          messagesView && fixedHeight
            ? "max-h-[45vh] md:max-h-[55vh]"
            : fixedHeight
            ? "max-h-[55vh] sm:max-h-[75vh]"
            : "",
          "h-full w-full"
        )}
      >
        {media}
      </div>
    )
  }
)

SlideContent.displayName = "PostContent"
