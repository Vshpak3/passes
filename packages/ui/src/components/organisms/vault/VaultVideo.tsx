import { FC, useEffect, useRef } from "react"
import { Video } from "src/components/atoms/Video"
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

interface VaultVideoProps {
  videoUrl: string
}

export const VaultVideo: FC<VaultVideoProps> = ({ videoUrl }) => {
  const videoJsOptions: VideoJsPlayerOptions = {
    controls: true,
    aspectRatio: "16:9",
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoUrl,
        type: "video/mp4"
      }
    ]
  }

  const handlePlayerReady = (player: VideoJsPlayer) => {
    player.on("error", function () {
      player.errorDisplay.close()
    })
  }

  const videoRef = useRef()
  const playerRef = useRef<VideoJsPlayer | null>(null)

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = videoRef.current

      if (!videoElement) {
        return
      }

      const player = (playerRef.current = videojs(
        videoElement,
        videoJsOptions,
        () => {
          handlePlayerReady(player)
        }
      ))
    } else {
      const player = playerRef.current
      videoJsOptions?.sources && player?.src(videoJsOptions?.sources[0].src)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, videoRef])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Video ref={videoRef} />
}
