import { ContentDtoContentTypeEnum } from "@passes/api-client"
import { FC } from "react"
import { PostImage, PostImageProps } from "src/components/atoms/PostImage"
import { ContentService } from "src/helpers/content"

import { PostVideo } from "./post/PostVideo"

export interface PostContentProps extends PostImageProps {
  setPostHandler?: () => void
}

export const PostContent: FC<PostContentProps> = ({
  content,
  ref,
  onMediaLoad,
  setPostHandler
}) => {
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
          videoUrl={ContentService.userContentMedia(content)}
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
