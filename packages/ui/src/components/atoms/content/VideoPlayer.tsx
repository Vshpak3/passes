// Styles
import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { forwardRef } from "react"

import { ContentService } from "src/helpers/content"

interface VideoPlayerProps {
  content: ContentDto
  autoplay?: boolean
  className?: string
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ content, autoplay = false, className = "" }, ref) => {
    const videoThumbnail = ContentService.userContentThumbnailPath(content)
    return (
      <video
        autoPlay={autoplay}
        className={classNames(className)}
        controls
        poster={videoThumbnail}
        preload={autoplay ? "auto" : "none"}
        ref={ref}
        src={ContentService.userContentMediaPath(content)}
      />
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
