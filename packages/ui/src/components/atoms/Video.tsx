import "video.js/dist/video-js.css"

import React, { useEffect, useRef } from "react"
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

interface VideoProps {
  options: VideoJsPlayerOptions
  onReady: (player: VideoJsPlayer) => void
}

export const Video = (props: VideoProps) => {
  const videoRef = useRef(null)
  const playerRef = useRef<VideoJsPlayer | null>(null)
  const { options, onReady } = props

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current

      if (!videoElement) {
        return
      }

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player)
      }))
    }
  }, [onReady, options, videoRef])

  // Dispose the Video.js player when the functional component unmounts
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
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  )
}

export default Video
