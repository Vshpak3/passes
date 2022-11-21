import classNames from "classnames"
import { memo, useEffect } from "react"

import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"
import { useVideoPlayer } from "src/hooks/useVideoPlayer"
import { VideoPlayer } from "./VideoPlayer"

const VideoContentUnmemo = ({
  contentFile,
  isActive,
  autoplay
}: {
  contentFile: ContentFile
  isActive: boolean
  autoplay?: boolean
}) => {
  const { ref, pause } = useVideoPlayer()
  const videoThumbnail = contentFile.content
    ? ContentService.userContentThumbnailPath(contentFile.content)
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
            contentFile.content
              ? ContentService.userContentMediaPath(contentFile.content)
              : contentFile.file
              ? URL.createObjectURL(contentFile.file)
              : ""
          }
        />
      </div>
    </>
  )
}

export const VideoContent = memo(VideoContentUnmemo)
