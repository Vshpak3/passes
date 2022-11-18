import classNames from "classnames"
import Hls from "hls.js"
import { forwardRef, useEffect } from "react"

interface VideoPlayerProps {
  src: string
  autoplay?: boolean
  className?: string
  poster?: string
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, autoplay = false, className = "", poster = "" }, ref) => {
    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const video = ref?.current
      if (!video) {
        return
      }

      // First check for native browser HLS support
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src
        // If no native HLS support, check if HLS.js is supported
      } else if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
      }
    }, [src, ref])

    return (
      <video
        autoPlay={autoplay}
        className={classNames(className)}
        controls
        controlsList="nodownload"
        poster={poster}
        preload={autoplay ? "auto" : "none"}
        ref={ref}
      />
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
