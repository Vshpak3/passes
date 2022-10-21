import { ContentDtoContentTypeEnum } from "@passes/api-client"
import { FC, ForwardedRef, forwardRef } from "react"
import { PostImage, PostImageProps } from "src/components/atoms/PostImage"
import { ContentService } from "src/helpers/content"

import { PostVideo } from "./post/PostVideo"

export interface PostContentProps extends PostImageProps {
  setPostHandler?: () => void
  ref: ForwardedRef<HTMLImageElement>
}

export const PostContent: FC<PostContentProps> = forwardRef(
  (
    { content, setPostHandler, onMediaLoad },
    ref: ForwardedRef<HTMLImageElement>
  ) => {
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
      <button className="w-full" onClick={setPostHandler}>
        {contentElement}
      </button>
    ) : (
      <></>
    )
  }
)

PostContent.displayName = "PostContent"
