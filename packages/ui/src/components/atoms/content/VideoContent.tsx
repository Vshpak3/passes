import classNames from "classnames"
import PlayIcon from "public/icons/media-play-circle-icon.svg"
import { CSSProperties, memo, useEffect, useState } from "react"

import { ContentService } from "src/helpers/content"
import { ContentFile } from "src/hooks/useMedia"
import { useVideoPlayer } from "src/hooks/useVideoPlayer"
import { VideoPlayer } from "./VideoPlayer"

interface VideoContentProps {
  contentFile: ContentFile
  isActive: boolean
  autoplay?: boolean
  style?: CSSProperties
  hidePlayButton?: boolean
}

const VideoContentUnmemo = ({
  contentFile,
  isActive,
  autoplay,
  style,
  hidePlayButton
}: VideoContentProps) => {
  const { ref, pause, isPlaying, play } = useVideoPlayer()
  const videoThumbnail = contentFile.content
    ? ContentService.userContentThumbnailPath(contentFile.content)
    : undefined
  useEffect(() => {
    if (!isActive) {
      pause()
    }
  }, [isActive, pause])
  const [showControls, setShowControls] = useState<boolean>(false)
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
          setShowControls={setShowControls}
          showControls={showControls}
          src={
            contentFile.content
              ? ContentService.userContentMediaPath(contentFile.content)
              : contentFile.file
              ? URL.createObjectURL(contentFile.file)
              : ""
          }
          style={style}
        />
      </div>
      {!hidePlayButton && !showControls && !isPlaying ? (
        <div
          className="absolute left-[50%] z-50 translate-x-[-50%] md:hidden"
          onClick={play}
        >
          <PlayIcon />
        </div>
      ) : null}
    </>
  )
}

export const VideoContent = memo(VideoContentUnmemo)
