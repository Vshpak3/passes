// Styles
import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { forwardRef } from "react"

import { ContentService } from "src/helpers/content"

interface VideoPlayerProps {
  content: ContentDto
  autoplay?: boolean
  className?: string
  poster: string
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ content, autoplay = false, className = "", poster }, ref) => {
    return (
      <video
        autoPlay={autoplay}
        className={classNames(className)}
        controls
        poster={poster}
        preload={autoplay ? "auto" : "none"}
        ref={ref}
        src={ContentService.userContentMediaPath(content)}
      />
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
