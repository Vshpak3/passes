import { ContentDto, PostApi, PostDto } from "@passes/api-client"
import ms from "ms"
import NextImageArrow from "public/icons/next-slider-arrow.svg"
import PrevImageArrow from "public/icons/prev-slider-arrow.svg"
import { FC, ReactNode, useEffect, useRef, useState } from "react"
import Slider from "react-slick"
import {
  PostContent,
  PostContentProps
} from "src/components/molecules/PostContent"
import { useViewPostModal } from "src/hooks/useViewPostModal"

const CHECK_FOR_PROCESSED_CONTENT = ms("5 seconds")

interface PostMediaProps {
  postId: string
  contents: PostDto["contents"]
  isNewPost?: boolean
  setPostHandler?: PostContentProps["setPostHandler"]
}

export const PostMedia: FC<PostMediaProps> = ({
  postId,
  contents = [],
  isNewPost = false,
  setPostHandler
}) => {
  const { viewPostActiveIndex } = useViewPostModal()
  const activeIndex = viewPostActiveIndex.current?.[postId] || 0
  const [activeSlideIndex, setActiveSlideIndex] = useState(activeIndex)
  const sliderSettings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: false,
    arrows: false,
    initialSlide: activeIndex,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextImageArrow />,
    prevArrow: <PrevImageArrow />,
    afterChange: async (current: number) => {
      setActiveSlideIndex(current)
      viewPostActiveIndex.current = { [postId as string]: current }
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
  const imgRef = useRef<HTMLImageElement>(null)
  const sliderRef = useRef<Slider | null>(null)

  const [refresh, setRefresh] = useState(0)
  const [isProcessing, setIsProcessing] = useState(
    !!contents.length && isNewPost
  )
  const [postContent, setPostContent] = useState(contents)

  const postApi = new PostApi()

  // For now we don't have any logic when the content has loaded
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onMediaLoad = () => () => {}

  const checkForProcessContent = async () => {
    const res = await postApi.isAllPostContentProcessed({ postId })
    if (res.contentProcessed) {
      setIsProcessing(false)
      setPostContent(res.contents || [])
    }
  }

  // Used for new posts to ensure the content shows up
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(async () => {
        checkForProcessContent()
        setRefresh(refresh + 1)
      }, CHECK_FOR_PROCESSED_CONTENT)

      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing, refresh])

  return (
    <div className="relative mt-3 flex w-full items-center justify-center bg-transparent">
      {isProcessing ? (
        <div className="relative mb-[30px] rounded-md border-2 border-passes-purple-100 px-[25px] py-[15px]">
          Please wait; your content is being processed.
        </div>
      ) : postContent.length === 1 ? (
        <PostContent
          content={postContent[0]}
          ref={imgRef}
          onMediaLoad={onMediaLoad}
          setPostHandler={setPostHandler}
        />
      ) : (
        postContent.length > 1 && (
          <div className="relative w-[100%]">
            {activeSlideIndex !== postContent.length - 1 && (
              <button
                className="absolute right-[15px] bottom-[50%] z-[3] translate-y-[50%]"
                onClick={() => sliderRef.current?.slickNext()}
              >
                <NextImageArrow />
              </button>
            )}
            <div className="absolute right-[10px] top-[14px] z-[2] w-fit rounded-[24px] bg-black/[0.15] px-[16px] py-[6px]">
              {activeSlideIndex + 1}/{postContent.length}
            </div>
            <Slider
              ref={(ref) => (sliderRef.current = ref)}
              {...sliderSettings}
            >
              {postContent.map((c: ContentDto, index: number) => {
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
      )}
    </div>
  )
}
