import { ContentDto } from "@passes/api-client"
import { FC, RefObject } from "react"

export interface PostImageProps {
  content: ContentDto
  ref: RefObject<HTMLImageElement>
  startLoadingHandler: () => () => void
}

export const PostImage: FC<PostImageProps> = ({
  content,
  ref,
  startLoadingHandler
}) => {
  return (
    <img
      ref={ref}
      onLoad={startLoadingHandler}
      key={content.contentId}
      src={content.signedUrl}
      alt=""
      className="h-[400px] w-full rounded-[20px] object-cover"
    />
  )
}
