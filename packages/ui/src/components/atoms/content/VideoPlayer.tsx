import classNames from "classnames"
import Hls from "hls.js"
import { CSSProperties, forwardRef, useEffect, useMemo, useState } from "react"

interface VideoPlayerProps {
  src: string
  className?: string
  poster?: string
  style?: CSSProperties
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, className = "", poster = "", style }, ref) => {
    const hls = useMemo(
      () =>
        new Hls({
          autoStartLoad: false,
          // Broken until 1.2.8: https://github.com/video-dev/hls.js/issues/5015
          enableWorker: false,
          // Send cookies (necessary for creators)
          xhrSetup: function (xhr) {
            xhr.withCredentials = true
          }
        }),
      []
    )

    // Triggers when the first onPlay event fires. Ensures we only start loading
    // the video once. This is necessary since we configure autoStartLoad = false
    // so we must manually call hls.startLoad() to start loading the fragments.
    const onPlay = () => {
      if (!initialized) {
        hls.startLoad()
      }
    }
    const [initialized, setInitialized] = useState(false)

    useEffect(() => {
      if (initialized) {
        return
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const video = ref?.current
      if (!video) {
        return
      }

      // Check if the src is a standalone mp4 or if there is native browser
      // HLS support. If not then check if HLS.js is supported.
      if (
        src.includes("-standalone.mp4") ||
        video.canPlayType("application/vnd.apple.mpegurl")
      ) {
        video.src = src
        setInitialized(true)
      } else if (Hls.isSupported()) {
        hls.loadSource(src)
        hls.attachMedia(video)
        // Sets initialized = true the first time a media segment is appended to the buffer
        hls.on(Hls.Events.BUFFER_APPENDED, () => {
          if (!initialized) {
            setInitialized(true)
          }
        })
      } else {
        console.error("No HLS support")
      }
    }, [src, ref, hls, initialized])

    const [showControls, setShowControls] = useState<boolean>(false)

    return (
      <video
        autoPlay={false}
        className={classNames(className)}
        controls={showControls}
        controlsList="nodownload"
        onBlur={() => setShowControls(false)}
        onFocus={() => setShowControls(true)}
        onPlay={onPlay}
        poster={poster}
        preload="none"
        ref={ref}
        style={style}
      />
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
