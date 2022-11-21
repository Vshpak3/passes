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
import { ContentLockButton } from "src/components/organisms/content/ContentLockButton"
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
  messagesView?: boolean
  isOwner?: boolean
}

export const ContentCarousel: FC<ContentCarouselProps> = ({
  contents,
  autoplayVideo = false,
  paying = false,
  paid = false,
  previewIndex = 0,
  price = 0,
  openBuyModal,
  activeIndex = 0,
  messagesView = false,
  isOwner = false
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  const hasAccess = paid || price === 0 || previewIndex >= contents.length

  return (
    <>
      <Swiper
        autoplay={false}
        initialSlide={activeIndex}
        modules={[Pagination, Navigation]}
        navigation
        pagination={{
          type: "fraction",
          formatFractionCurrent: (x) => x,
          formatFractionTotal: () => contents.length
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
                  fixedHeight
                  index={index}
                  isActive={isActive}
                  messagesView={messagesView}
                  ref={imgRef}
                />
              )}
            </SwiperSlide>
          ) : null
        })}
        {!!hasAccess && openBuyModal && (
          <SwiperSlide>
            <LockedMedia
              contents={contents}
              fixedHeight
              messagesView={messagesView}
              openBuyModal={openBuyModal}
              paying={paying}
              previewIndex={previewIndex}
              price={price}
            />
          </SwiperSlide>
        )}
      </Swiper>
      {!price && !!isOwner && (
        <ContentLockButton
          contents={contents}
          openBuyModal={openBuyModal}
          paid={!!paid}
          paying={!!paying}
          previewIndex={previewIndex}
          price={price}
        />
      )}
    </>
  )
}
