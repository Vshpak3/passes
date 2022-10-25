// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-unresolved */
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

import { ContentDto } from "@passes/api-client"
import { FC, useRef } from "react"
import { PostContent } from "src/components/molecules/PostContent"
import { Lazy, Navigation, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"

interface CarouselProps {
  contents: ContentDto[]
  activeIndex?: number
  isAutoPlay?: boolean
}

export const Carousel: FC<CarouselProps> = ({ contents, isAutoPlay }) => {
  const imgRef = useRef<HTMLImageElement>(null)
  return (
    <>
      <style>{`.swiper-button-prev, .swiper-button-next { color: white; }`}</style>
      <Swiper
        pagination={{
          type: "fraction"
        }}
        navigation={true}
        modules={[Lazy, Pagination, Navigation]}
        className="mySwiper"
        lazy={true}
      >
        {contents.map((c: ContentDto, index: number) => {
          return (
            <SwiperSlide key={index}>
              <PostContent
                key={index}
                content={c}
                ref={imgRef}
                isAutoPlay={isAutoPlay}
              />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </>
  )
}
