import { ContentDto } from "@passes/api-client"
import { FC, RefObject } from "react"
import { ContentService } from "src/helpers/content"

export interface PostImageProps {
  content: ContentDto
  ref: RefObject<HTMLImageElement>
  onMediaLoad?: () => () => void
}

export const PostImage: FC<PostImageProps> = ({
  content,
  ref,
  onMediaLoad
}) => {
  return (
    <img
      ref={ref}
      onLoad={onMediaLoad}
      key={content.contentId}
      src={ContentService.userContentMedia(content)}
      alt=""
      className="h-[400px] w-full rounded-[20px] object-cover"
    />
  )
}
