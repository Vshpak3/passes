import { ContentDtoContentTypeEnum } from "@passes/api-client"
import { FC } from "react"
import { PostImage, PostImageProps } from "src/components/atoms/PostImage"

import { PostVideo } from "./post/PostVideo"

type PostContentProps = PostImageProps

export const PostContent: FC<PostContentProps> = ({
  content,
  ref,
  startLoadingHandler,
  setPostHandler
}) => {
  return (
    <>
      {content.contentType === ContentDtoContentTypeEnum.Image ? (
        <PostImage
          content={content}
          ref={ref}
          startLoadingHandler={startLoadingHandler}
          setPostHandler={setPostHandler}
        />
      ) : content.contentType === ContentDtoContentTypeEnum.Video ? (
        <PostVideo key={content.contentId} videoUrl={content.signedUrl ?? ""} />
      ) : (
        <></>
      )}
    </>
  )
}
