import { Video } from "src/components/atoms/Video"
import { VideoJsPlayer, VideoJsPlayerOptions } from "video.js"

interface PostVideoProps {
  videoUrl: string
}

const PostVideo = ({ videoUrl }: PostVideoProps) => {
  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: false,
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

  // TODO: add this callback
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  const handlePlayerReady = (player: VideoJsPlayer) => {}

  return <Video options={videoJsOptions} onReady={handlePlayerReady} />
}

export default PostVideo
