import classNames from "classnames"
import { memo, useEffect } from "react"

import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"
import { useVideoPlayer } from "src/hooks/useVideoPlayer"
import { VideoPlayer } from "./VideoPlayer"

const VideoContentUnmemo = ({
  content,
  isActive,
  autoplay
}: {
  content: ContentFile
  isActive: boolean
  autoplay?: boolean
}) => {
  const { ref, pause } = useVideoPlayer()
  const videoThumbnail = content.content
    ? ContentService.userContentThumbnailPath(content.content)
    : undefined
  useEffect(() => {
    if (!isActive) {
      pause()
    }
  }, [isActive, pause])
  return (
    <>
      <div
        className={classNames(
          "absolute inset-0 inset-x-4 z-10 h-auto bg-cover bg-center [filter:blur(10px)opacity(80%)]"
        )}
        style={{
          backgroundImage: `url(${videoThumbnail})`
        }}
      />
      <div className="flex h-full w-full items-center justify-center">
        <VideoPlayer
          autoplay={autoplay}
          className="relative z-20 inline-block h-auto max-h-full max-w-full object-contain"
          poster={videoThumbnail}
          ref={ref}
          src={
            content.content
              ? ContentService.userContentMediaPath(content.content)
              : content.file
              ? URL.createObjectURL(content.file)
              : ""
          }
        />
      </div>
    </>
  )
}

export const VideoContent = memo(VideoContentUnmemo)
