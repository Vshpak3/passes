import { ContentDto } from "@passes/api-client"
import NextImageArrow from "public/icons/next-slider-arrow.svg"
import PrevImageArrow from "public/icons/prev-slider-arrow.svg"
import { FC, ReactNode, useRef, useState } from "react"
import Slider, { LazyLoadTypes } from "react-slick"
import { PostContent } from "src/components/molecules/PostContent"

interface CarouselProps {
  contents: ContentDto[]
  onMediaLoad?: () => () => void
  setPostHandler?: () => void
  afterChangeHandler?: (current: number) => void
  activeIndex?: number
}

export const Carousel: FC<CarouselProps> = ({
  contents,
  onMediaLoad,
  setPostHandler,
  afterChangeHandler,
  activeIndex = 0
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(activeIndex)
  const sliderSettings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: false,
    arrows: false,
    fade: true,
    lazyLoad: "ondemand" as LazyLoadTypes,
    initialSlide: activeIndex,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextImageArrow />,
    prevArrow: <PrevImageArrow />,
    afterChange: (current: number) => {
      setActiveSlideIndex(current)
      if (afterChangeHandler) {
        afterChangeHandler(current)
      }
    },
    appendDots: (dots: ReactNode) => <ul>{dots}</ul>,
    customPaging: (i: number) => (
      <div className="absolute bottom-[30px]">
        <div
          className={`${
            activeSlideIndex === i ? "bg-white" : "bg-white/[0.49]"
          } h-[9px] w-[9px] rounded-[50%]`}
        />
      </div>
    )
  }
  const sliderRef = useRef<Slider | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  return (
    <div className="relative w-full">
      {activeSlideIndex !== contents.length - 1 && (
        <button
          className="absolute right-[15px] bottom-[50%] z-[3] translate-y-[50%]"
          onClick={() => sliderRef.current?.slickNext()}
        >
          <NextImageArrow />
        </button>
      )}
      <div className="absolute right-[10px] top-[14px] z-[2] w-fit select-none rounded-[24px] bg-black/[0.15] px-[16px] py-[6px]">
        {activeSlideIndex + 1}/{contents.length}
      </div>
      <Slider ref={(ref) => (sliderRef.current = ref)} {...sliderSettings}>
        {contents.map((c: ContentDto, index: number) => {
          return (
            <PostContent
              key={index}
              content={c}
              ref={imgRef}
              onMediaLoad={onMediaLoad}
              setPostHandler={setPostHandler}
            />
          )
        })}
      </Slider>
      {activeSlideIndex !== 0 && (
        <button
          className="absolute left-[15px] bottom-[50%] z-[3] translate-y-[50%]"
          onClick={() => sliderRef.current?.slickPrev()}
        >
          <PrevImageArrow />
        </button>
      )}
    </div>
  )
}
