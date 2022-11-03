import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { useEffect } from "react"

import { ContentService } from "src/helpers/content"
import { useVideoPlayer } from "src/hooks/useVideoPlayer"
import { VideoPlayer } from "./VideoPlayer"

export const VideoContent = ({
  content,
  fixedHeight,
  isActive,
  autoplay
}: {
  content: ContentDto
  fixedHeight: boolean
  isActive: boolean
  autoplay?: boolean
}) => {
  const { ref, pause } = useVideoPlayer()
  const videoThumbnail = ContentService.userContentThumbnailPath(content)
  useEffect(() => {
    if (!isActive) {
      pause()
    }
  }, [isActive, pause])
  return (
    <div
      className={classNames(fixedHeight ? "max-h-[75vh]" : "", "h-full w-full")}
    >
      <div className="relative h-full max-h-[1200px] cursor-pointer">
        <div className="relative h-full overflow-hidden">
          <div
            className={classNames(
              "absolute inset-0 inset-x-4 z-10 h-auto max-h-[800px] bg-cover bg-center [filter:blur(10px)opacity(80%)]"
            )}
            style={{
              backgroundImage: `url(${videoThumbnail})`
            }}
          />
          <div className="flex h-full w-full items-center justify-center">
            <VideoPlayer
              autoplay={autoplay}
              className="relative  z-20 inline-block h-auto  max-h-full max-w-full  object-contain"
              content={content}
              poster={videoThumbnail}
              ref={ref}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
