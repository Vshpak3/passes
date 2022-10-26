// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-unresolved */
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { ContentDto } from "@passes/api-client"
import { FC, useRef } from "react"
import { Lazy, Navigation, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { content } from "tailwind.config"

import { PostContent } from "src/components/molecules/PostContent"
import { LockedMedia } from "./LockedMedia"

export interface ContentCarouselProps {
  contents: ContentDto[]
  activeIndex?: number
  autoplayVideo?: boolean
  paying: boolean
  paid: boolean
  previewIndex: number
  price: number
  openBuyModal: () => void
}

export const ContentCarousel: FC<ContentCarouselProps> = ({
  contents,
  autoplayVideo,
  paying,
  paid,
  previewIndex,
  price,
  openBuyModal
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const hasAccess = paid || price === 0 || previewIndex >= content.length
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
          return hasAccess || index < previewIndex ? (
            <SwiperSlide key={index}>
              <PostContent
                key={index}
                content={c}
                ref={imgRef}
                autoplayVideo={autoplayVideo}
              />
            </SwiperSlide>
          ) : (
            <></>
          )
        })}
        {!hasAccess && (
          <SwiperSlide>
            <LockedMedia
              contents={contents}
              price={price}
              paying={paying}
              openBuyModal={openBuyModal}
            />
          </SwiperSlide>
        )}
      </Swiper>
    </>
  )
}
