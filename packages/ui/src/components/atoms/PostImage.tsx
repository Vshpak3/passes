import { ContentDto } from "@passes/api-client"
import { FC, RefObject } from "react"
import { ContentService } from "src/helpers/content"

export interface PostImageProps {
  content: ContentDto
  ref: RefObject<HTMLImageElement>
  startLoadingHandler?: () => () => void
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
      src={ContentService.userContentMedia(content)}
      alt=""
      className="h-[400px] w-full rounded-[20px] object-cover"
    />
  )
}
