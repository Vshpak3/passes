import DOMPurify from "dompurify"
import React from "react"
import { Button, GradientBorderTile } from "src/components/atoms"
import { Video } from "src/components/atoms/Video"
import { VideoJsPlayer } from "video.js"

interface IPassVideo {
  img: {
    url: string
    alt: string
  }
}

interface IPassCard {
  img: {
    url: string
    alt: string
  }
  title: string
  description: string
  onSelect: () => void
  isSelected: boolean
  price: number
  ethPrice: number
}

const PassVideo = ({ img }: IPassVideo) => {
  const handlePlayerReady = (player: VideoJsPlayer) => {
    player.on("error", function () {
      player.errorDisplay.close()
    })
  }
  return (
    <Video
      options={{
        controls: false,
        loop: true,
        fluid: true,
        responsive: true,
        autoplay: true,
        sources: [
          {
            src: "https://cdn.passes-staging.com/nft/22e4875d-fd9c-4b8a-b2f7-8ba9221544a9/image.mp4",
            type: "video/mp4"
          },
          { src: img.alt, type: "video/mp4" }
        ]
      }}
      onReady={handlePlayerReady}
    />
  )
}

const MemoPassVideo = React.memo(PassVideo)

const PassCard: React.FC<IPassCard> = ({
  img,
  title,
  description,
  onSelect,
  isSelected,
  price,
  ethPrice
}) => {
  return (
    <div className="relative flex-1 rounded-[20px] bg-black/25">
      <img
        src="/img/lucyplooza/gradient-boder-frame.png"
        alt="gradient frame"
        className="absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 p-8 pt-[30px]">
        {/* <img src={img.url} alt={img.alt} className="h-[415px] w-full" /> */}
        <MemoPassVideo img={img} />
        <h4 className="mt-4 text-2xl font-bold leading-[24px]">{title}</h4>

        <p className="mt-4 text-sm leading-[18px]">
          ${price} (USD/USDC) or {ethPrice / 10 ** 18} eth
        </p>
        <p className="mt-4 text-sm leading-[18px]">What you get:</p>
        <ul
          className="list-inside list-disc pl-2 text-sm leading-[18px]"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
        />

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

export default React.memo(PassCard)
