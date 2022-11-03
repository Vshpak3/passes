import { ContentDto } from "@passes/api-client"
import classNames from "classnames"
import { useEffect } from "react"

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

  useEffect(() => {
    if (!isActive) {
      pause()
    }
  }, [isActive, pause])
  return (
    <div
      className={classNames(fixedHeight ? "max-h-[85vh]" : "", "h-full w-full")}
    >
      <div className="relative h-full max-h-[1200px] cursor-pointer">
        <div className="relative h-full overflow-hidden">
          <div
            className={classNames(
              "absolute inset-0 inset-x-4 z-10 h-auto max-h-[800px] bg-cover bg-center [filter:blur(10px)opacity(80%)]"
            )}
            style={{
              backgroundImage: `url(http://localhost:4566/passes/media/58eb9094-5816-4149-9c19-3f21612a97d4/044b84f1-ef20-4230-9904-3a7d29340c48.jpeg)`
            }}
          />
          <div className="flex h-full w-full items-center justify-center">
            <VideoPlayer
              autoplay={autoplay}
              className="relative  z-20 inline-block h-auto  max-h-full max-w-full  object-contain"
              content={content}
              ref={ref}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
