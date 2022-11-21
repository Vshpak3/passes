import classNames from "classnames"
import Hls from "hls.js"
import { forwardRef, useEffect, useState } from "react"

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

      // Support for standalone mp4s as opposed to HLS
      if (src.includes("-standalone.mp4")) {
        video.src = src
        return
      }

      // Check for native browser HLS support and if not then check if HLS.js is supported
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          // TODO: PASS-1396
          autoStartLoad: true,
          // Broken until 1.2.8: https://github.com/video-dev/hls.js/issues/5015
          enableWorker: false,
          // Send cookies (necessary for creators)
          xhrSetup: function (xhr) {
            xhr.withCredentials = true
          }
        })
        hls.loadSource(src)
        hls.attachMedia(video)
      } else {
        console.error("No HLS support")
      }
    }, [src, ref])

    const [showControls, setShowControls] = useState<boolean>(false)

    return (
      <video
        autoPlay={autoplay}
        className={classNames(className)}
        controls={showControls}
        controlsList="nodownload"
        onBlur={() => setShowControls(false)}
        onFocus={() => setShowControls(true)}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        poster={poster}
        preload={autoplay ? "auto" : "none"}
        ref={ref}
      />
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
