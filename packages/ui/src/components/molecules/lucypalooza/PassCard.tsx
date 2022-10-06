import DOMPurify from "dompurify"
import React from "react"
import { Button, GradientBorderTile } from "src/components/atoms"

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
  totalSupply: number
  remainingSupply: number
}

const PassVideo = ({ img }: IPassVideo) => {
  return (
    <video autoPlay loop muted poster={img.alt}>
      <source src={img.url} type="video/mp4" />
    </video>
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
  ethPrice,
  totalSupply,
  remainingSupply
}) => {
  return (
    <div className="relative flex-1 rounded-[20px] bg-black/25">
      <img
        src="/img/lucyplooza/gradient-boder-frame.png"
        alt="gradient frame"
        className="absolute inset-0 h-full w-full"
      />

      <div className="relative z-10 flex h-full flex-col p-8 pt-[30px]">
        <div className="relative">
          <MemoPassVideo img={img} />
          <div className="absolute bottom-2 flex w-full justify-center">
            <div className="flex w-fit rounded-full bg-black/50 px-4 py-2">
              {`${remainingSupply}/${totalSupply} AVAILABLE`}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="mt-4 text-2xl font-bold leading-[24px]">{title}</h4>

          <p className="mt-4 text-sm leading-[18px]">
            ${price} (USD/USDC) or {ethPrice / 10 ** 18} eth
          </p>
          <p className="mt-4 text-sm leading-[18px]">What you get:</p>
          <ul
            className="list-inside list-disc pl-2 text-sm leading-[18px]"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description)
            }}
          />
        </div>

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
