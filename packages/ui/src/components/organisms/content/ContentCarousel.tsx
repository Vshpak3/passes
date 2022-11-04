// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-unresolved */
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import { ContentDto } from "@passes/api-client"
import { FC, useRef } from "react"
import { Navigation, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"

import { SlideContent } from "src/components/molecules/content/SlideContent"
import { LockedMedia } from "./LockedMedia"

export interface ContentCarouselProps {
  contents: ContentDto[]
  activeIndex?: number
  autoplayVideo?: boolean
  paying?: boolean
  paid?: boolean
  previewIndex?: number
  price?: number
  openBuyModal?: () => void
}

export const ContentCarousel: FC<ContentCarouselProps> = ({
  contents,
  autoplayVideo = false,
  paying = false,
  paid = false,
  previewIndex = 0,
  price = 0,
  openBuyModal,
  activeIndex = 0
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const hasAccess = paid || price === 0 || previewIndex >= contents.length

  return (
    <>
      <style>{`.swiper-button-prev, .swiper-button-next { color: white; } .swiper-slide{height:auto;}`}</style>
      <Swiper
        autoplay={false}
        initialSlide={activeIndex}
        modules={[Pagination, Navigation]}
        navigation
        pagination={{
          type: "fraction"
        }}
        watchSlidesProgress
      >
        {contents.map((c: ContentDto, index: number, array: ContentDto[]) => {
          return hasAccess || index < previewIndex ? (
            <SwiperSlide key={index}>
              {({ isActive }) => (
                <SlideContent
                  autoplayVideo={autoplayVideo}
                  carouselContent={array}
                  content={c}
                  fixedHeight={contents.length > 1}
                  index={index}
                  isActive={isActive}
                  ref={imgRef}
                />
              )}
            </SwiperSlide>
          ) : null
        })}
        {!hasAccess && openBuyModal && (
          <SwiperSlide>
            <LockedMedia
              contents={contents}
              fixedHeight={contents.length > 1}
              openBuyModal={openBuyModal}
              paying={paying}
              previewIndex={previewIndex}
              price={price}
            />
          </SwiperSlide>
        )}
      </Swiper>
    </>
  )
}
