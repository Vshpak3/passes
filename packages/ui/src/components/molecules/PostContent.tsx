import { ContentDto, ContentDtoContentTypeEnum } from "@passes/api-client"
import { FC, ForwardedRef, forwardRef, useEffect, useState } from "react"

import { PostImage, PostImageProps } from "src/components/atoms/PostImage"
import { MediaModal } from "src/components/organisms/MediaModal"
import { ContentService } from "src/helpers/content"
import { PostVideo } from "./post/PostVideo"

interface PostContentProps extends PostImageProps {
  ref: ForwardedRef<HTMLImageElement>
  autoplayVideo?: boolean
  carouselContent?: ContentDto[]
  index?: number
}

export const PostContent: FC<PostContentProps> = forwardRef(
  (
    { content, autoplayVideo, carouselContent, index = 0 }: PostContentProps,
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
            <button className="w-full" onClick={onImgClickHandler}>
              <PostImage content={content} ref={ref} />
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
          <PostVideo
            key={content.contentId}
            videoUrl={ContentService.userContentMediaPath(content)}
            autoplayVideo={autoplayVideo}
          />
        )
    }
    return null
  }
)

PostContent.displayName = "PostContent"
