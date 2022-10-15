import { ContentDtoContentTypeEnum } from "@passes/api-client"
import { FC } from "react"
import { PostImage, PostImageProps } from "src/components/atoms/PostImage"

import { PostVideo } from "./post/PostVideo"

export interface PostContentProps extends PostImageProps {
  setPostHandler?: () => void
}

export const PostContent: FC<PostContentProps> = ({
  content,
  ref,
  startLoadingHandler,
  setPostHandler
}) => {
  let contentElement: JSX.Element | undefined
  switch (content.contentType) {
    case ContentDtoContentTypeEnum.Image:
      contentElement = (
        <PostImage
          content={content}
          ref={ref}
          startLoadingHandler={startLoadingHandler}
        />
      )
      break
    case ContentDtoContentTypeEnum.Video:
      contentElement = (
        <PostVideo key={content.contentId} videoUrl={content.signedUrl ?? ""} />
      )
      break
  }

  return contentElement ? (
    <button onClick={setPostHandler}>{contentElement}</button>
  ) : (
    <></>
  )
}
