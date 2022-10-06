import DOMPurify from "dompurify"
import React from "react"
import { Button, GradientBorderTile } from "src/components/atoms"
import { Video } from "src/components/atoms/Video"
import { VideoJsPlayer } from "video.js"

interface IPassCard {
  img: {
    url: string
    alt: string
  }
  title: string
  description: string
  onSelect: () => void
  isSelected: boolean
}

const PassCard: React.FC<IPassCard> = ({
  img,
  title,
  description,
  onSelect,
  isSelected
}) => {
  const handlePlayerReady = (player: VideoJsPlayer) => {
    player.on("error", function () {
      player.errorDisplay.close()
    })
  }
  return (
    <div className="relative flex-1 rounded-[20px] bg-black/25">
      <img
        src="/img/lucyplooza/gradient-boder-frame.png"
        alt="gradient frame"
        className="absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 p-8 pt-[30px]">
        {/* <img src={img.url} alt={img.alt} className="h-[415px] w-full" /> */}
        <Video
          options={{ controls: false, loop: true, src: img.url }}
          onReady={handlePlayerReady}
        />
        <h4 className="mt-4 text-2xl font-bold leading-[24px]">{title}</h4>
        <p className="mt-4 text-sm leading-[18px]">What you get:</p>
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
        ></div>

        {isSelected ? (
          <GradientBorderTile
            className="mt-4 !h-[55px] !w-full !rounded-full"
            innerClass="!rounded-full overflow-hidden"
          >
            <span className="text-label flex h-full w-full items-center justify-center bg-black uppercase">
              Selected
            </span>
          </GradientBorderTile>
        ) : (
          <Button
            onClick={onSelect}
            className="mt-4 w-full !py-5 text-base font-bold uppercase"
            variant="purple-light"
            tag="button"
          >
            SELECT PASS
          </Button>
        )}
      </div>
    </div>
  )
}

export default PassCard
