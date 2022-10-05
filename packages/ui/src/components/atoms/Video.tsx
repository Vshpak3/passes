import "video.js/dist/video-js.css"

import React, { FC, LegacyRef, useEffect, useRef } from "react"
import { useOnScreen } from "src/hooks/useOnScreen"
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

interface VideoProps {
  options: VideoJsPlayerOptions
  onReady: (player: VideoJsPlayer) => void
}

type VideRefType = LegacyRef<HTMLVideoElement> | undefined

export const Video: FC<VideoProps> = ({ options, onReady }) => {
  const intersectionOptions = {
    threshold: 0.7
  }
  const [ref, visible] = useOnScreen(intersectionOptions)
  const videoRef = ref
  const playerRef = useRef<VideoJsPlayer | null>(null)

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current

      if (!videoElement) {
        return
      }

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player)
      }))
    } else {
      const player = playerRef.current

      player?.autoplay(visible)
      options?.sources && player?.src(options?.sources[0].src)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, videoRef, visible, ref])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])
  return (
    <div data-vjs-player>
      <video
        ref={videoRef as VideRefType}
        className="video-js vjs-big-play-centered"
      />
    </div>
  )
}

export default Video
