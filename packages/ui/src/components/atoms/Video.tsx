import "video.js/dist/video-js.css"

import React, { FC, useEffect, useRef } from "react"
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

interface VideoProps {
  options: VideoJsPlayerOptions
  onReady: (player: VideoJsPlayer) => void
}

export const Video: FC<VideoProps> = ({ options, onReady }) => {
  const videoRef = useRef(null)
  const playerRef = useRef<VideoJsPlayer | null>(null)

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current

      if (!videoElement) {
        return
      }

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player)
        player.on("error", function () {
          // TODO: add in a custom error
          player.errorDisplay.close()
        })
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
