import classNames from "classnames"
import Hls from "hls.js"
import {
  CSSProperties,
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useMemo,
  useState
} from "react"
import { CSSProperties, forwardRef, useEffect, useState } from "react"

interface VideoPlayerProps {
  src: string
  autoplay?: boolean
  className?: string
  poster?: string
  style?: CSSProperties
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      src,
      autoplay = false,
      className = "",
      poster = "",
      style,
      showControls,
      setShowControls
    },
    ref
  ) => {
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

      // Support for standalone mp4s as opposed to HLS
      if (src.includes("-standalone.mp4")) {
        video.src = src
        setInitialized(true)
        return
      }

      // Check for native browser HLS support and if not then check if HLS.js is supported
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src
        setInitialized(true)
      } else if (Hls.isSupported()) {
        hls.loadSource(src)
        hls.attachMedia(video)
        // sets initialized = true the first time a media segment is appended to the buffer
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
        autoPlay={autoplay}
        className={classNames(className)}
        controls={showControls}
        controlsList="nodownload"
        onBlur={() => setShowControls(false)}
        onFocus={() => setShowControls(true)}
        onPlay={() => {
          if (!initialized) {
            hls.startLoad()
          }
        }}
        poster={poster}
        preload={autoplay ? "auto" : "none"}
        ref={ref}
        style={style}
      />
    )
  }
)

VideoPlayer.displayName = "VideoPlayer"
