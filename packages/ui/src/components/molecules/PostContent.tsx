import { ContentDtoContentTypeEnum } from "@passes/api-client"
import { FC, ForwardedRef, forwardRef, useState } from "react"
import { PostImage, PostImageProps } from "src/components/atoms/PostImage"
import { MediaModal } from "src/components/organisms/MediaModal"
import { ContentService } from "src/helpers/content"

import { PostVideo } from "./post/PostVideo"

export interface PostContentProps extends PostImageProps {
  ref: ForwardedRef<HTMLImageElement>
}

export const PostContent: FC<PostContentProps> = forwardRef(
  ({ content, onMediaLoad }, ref: ForwardedRef<HTMLImageElement>) => {
    const [openModal, setOpenModal] = useState(false)

    let contentElement: JSX.Element | undefined

    switch (content.contentType) {
      case ContentDtoContentTypeEnum.Image:
        contentElement = (
          <PostImage content={content} ref={ref} onMediaLoad={onMediaLoad} />
        )
        break
      case ContentDtoContentTypeEnum.Video:
        contentElement = (
          <PostVideo
            key={content.contentId}
            videoUrl={ContentService.userContentMediaPath(content)}
          />
        )
        break
    }

    return contentElement ? (
      <>
        <button className="w-full" onClick={() => setOpenModal(true)}>
          {contentElement}
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
    ) : (
      <></>
    )
  }
)

PostContent.displayName = "PostContent"
