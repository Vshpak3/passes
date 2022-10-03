import { useRef } from "react"
import { Video } from "src/components/atoms/Video"
import { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

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
  }

  return <Video options={videoJsOptions} onReady={handlePlayerReady} />
}

export default PostVideo
