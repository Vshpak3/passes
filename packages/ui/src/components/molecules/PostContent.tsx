import { ContentDtoContentTypeEnum } from "@passes/api-client"
import { FC, ForwardedRef, forwardRef, useEffect, useState } from "react"
import { PostImage, PostImageProps } from "src/components/atoms/PostImage"
import { MediaModal } from "src/components/organisms/MediaModal"
import { ContentService } from "src/helpers/content"

import { PostVideo } from "./post/PostVideo"

export interface PostContentProps extends PostImageProps {
  ref: ForwardedRef<HTMLImageElement>
  isAutoPlay?: boolean
}

export const PostContent: FC<PostContentProps> = forwardRef(
  ({ content, isAutoPlay }, ref: ForwardedRef<HTMLImageElement>) => {
    const [openModal, setOpenModal] = useState(false)
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
    switch (content.contentType) {
      case ContentDtoContentTypeEnum.Image:
        return (
          <>
            <button className="w-full" onClick={() => setOpenModal(true)}>
              <PostImage content={content} ref={ref} />
            </button>
            {openModal && (
              <MediaModal
                isOpen={openModal}
                setOpen={setOpenModal}
                file={{ content }}
                modalContainerClassname="p-0"
                childrenClassname="p-0"
              />
            )}
          </>
        )
      case ContentDtoContentTypeEnum.Video:
        return (
          <PostVideo
            key={content.contentId}
            videoUrl={ContentService.userContentMediaPath(content)}
            isAutoPlay={isAutoPlay}
          />
        )
    }
    return <></>
  }
)

PostContent.displayName = "PostContent"
