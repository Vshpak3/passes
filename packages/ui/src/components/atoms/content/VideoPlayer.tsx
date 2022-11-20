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
      // Temp disabled
      return

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const video = ref?.current
      if (!video) {
        return
      }

      // Check for native browser HLS support and if not then check if HLS.js is supported
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src
      } else if (Hls.isSupported()) {
        // TODO: For some reason the worker is not working
        const hls = new Hls({ enableWorker: false })
        hls.loadSource(src)
        hls.attachMedia(video)
      } else {
        console.error("No HLS support")
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
        src={src}
      />
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
