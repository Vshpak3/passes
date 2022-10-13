import { ContentDto, GetFeedResponseDto, PostDto } from "@passes/api-client"
import NextImageArrow from "public/icons/next-slider-arrow.svg"
import PrevImageArrow from "public/icons/prev-slider-arrow.svg"
import { FC, ReactNode, useEffect, useRef, useState } from "react"
import Slider from "react-slick"
import { PostContent } from "src/components/molecules/PostContent"
import { KeyedMutator } from "swr"

interface PostMediaProps {
  content: PostDto["content"]
  mutatePosts?: KeyedMutator<GetFeedResponseDto>
  setPostHandler?: () => void
}

export const PostMedia: FC<PostMediaProps> = ({
  content,
  mutatePosts,
  setPostHandler
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const sliderSettings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextImageArrow />,
    prevArrow: <PrevImageArrow />,
    afterChange: (current: number) => setActiveSlideIndex(current),
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
  const imgRef = useRef<HTMLImageElement>(null)
  const sliderRef = useRef<Slider | null>(null)
  const [isLoadingStart, setIsLoadingStart] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const startLoadingHandler = () => () => setIsLoadingStart(true)

  const onLoadingHandler = () => {
    setIsLoading(false)
  }

  useEffect(() => {
    mutatePosts && mutatePosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onLoadingHandler()
  }, [isLoadingStart])

  return (
    <div className="relative mt-3 flex w-full items-center justify-center bg-transparent">
      {!!content?.length &&
        (isLoading ? (
          <span>Please wait! Your content is being uploaded</span>
        ) : content.length > 1 ? (
          <div className="relative w-[100%]">
            {activeSlideIndex !== content.length - 1 && (
              <button
                className="absolute right-[15px] bottom-[50%] z-[3] translate-y-[50%]"
                onClick={() => sliderRef.current?.slickNext()}
              >
                <NextImageArrow />
              </button>
            )}
            <div className="absolute right-[10px] top-[14px] z-[2] w-fit rounded-[24px] bg-black/[0.15] px-[16px] py-[6px]">
              {activeSlideIndex + 1}/{content.length}
            </div>
            <Slider
              ref={(ref) => (sliderRef.current = ref)}
              {...sliderSettings}
            >
              {content.map((c: ContentDto, index: number) => {
                return (
                  <PostContent
                    key={index}
                    content={c}
                    ref={imgRef}
                    startLoadingHandler={startLoadingHandler}
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
        ) : (
          <PostContent
            content={content[0]}
            ref={imgRef}
            startLoadingHandler={startLoadingHandler}
            setPostHandler={setPostHandler}
          />
        ))}
    </div>
  )
}
