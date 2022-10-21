import { ContentDto } from "@passes/api-client"
import { FC, ForwardedRef, forwardRef } from "react"
import { ContentService } from "src/helpers/content"

export interface PostImageProps {
  content: ContentDto
  onMediaLoad?: () => () => void
  ref: ForwardedRef<HTMLImageElement>
}

export const PostImage: FC<PostImageProps> = forwardRef(
  ({ content, onMediaLoad }, ref: ForwardedRef<HTMLImageElement>) => {
    return (
      <img
        ref={ref}
        onLoad={onMediaLoad}
        key={content.contentId}
        src={ContentService.userContentMediaPath(content)}
        alt=""
        height={400}
        width={650}
        className="h-[400px] w-full select-none rounded-[20px] object-cover"
      />
    )
  }
)

PostImage.displayName = "PostImage"
