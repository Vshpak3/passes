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
  onMediaLoad?: () => () => void
  activeIndex?: number
}

export const Carousel: FC<CarouselProps> = ({ contents, onMediaLoad }) => {
  const imgRef = useRef<HTMLImageElement>(null)

  return (
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
              onMediaLoad={onMediaLoad}
            />
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
