import { Video } from "src/components/atoms/Video"
import { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

interface PostVideoProps {
  videoUrl: string
}

const PostVideo = ({ videoUrl }: PostVideoProps) => {
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

  return <Video options={videoJsOptions} onReady={handlePlayerReady} />
}

export default PostVideo
