import { useRef } from "react"
import { Video } from "src/components/atoms/Video"
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

interface PostVideoProps {
  videoUrl: string
}

const PostVideo = ({ videoUrl }: PostVideoProps) => {
  const playerRef = useRef<VideoJsPlayer | null>(null)

  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: true,
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
    playerRef.current = player

    player.on("waiting", () => {
      videojs.log("player is waiting")
    })

    player.on("dispose", () => {
      videojs.log("player will dispose")
    })
  }

  return <Video options={videoJsOptions} onReady={handlePlayerReady} />
}

export default PostVideo
