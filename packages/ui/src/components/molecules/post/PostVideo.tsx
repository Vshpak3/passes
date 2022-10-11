import { FC, useEffect, useRef } from "react"
import { Video } from "src/components/atoms/Video"
import { useOnScreen } from "src/hooks/useOnScreen"
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

interface PostVideoProps {
  videoUrl: string
}

export const PostVideo: FC<PostVideoProps> = ({ videoUrl }) => {
  const videoJsOptions: VideoJsPlayerOptions = {
    controls: true,
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

      const player = (playerRef.current = videojs(
        videoElement,
        videoJsOptions,
        () => {
          handlePlayerReady(player)
        }
      ))
    } else {
      const player = playerRef.current

      player?.autoplay(visible)
      videoJsOptions?.sources && player?.src(videoJsOptions?.sources[0].src)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, visible, ref])

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

export default PostVideo // eslint-disable-line import/no-default-export
