import { ContentDto, ContentDtoContentTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import CostIcon from "public/icons/post-cost-icon.svg"
import { FC, useEffect, useRef, useState } from "react"
import TimeAgo from "react-timeago"

import { ContentUnlockButton } from "src/components/atoms/button/ContentUnlockButton"
import { VideoContent } from "src/components/atoms/content/VideoContent"
import { UnlockText } from "src/components/organisms/UnlockText"
import { ContentService } from "src/helpers/content"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { formatCurrency, formatText } from "src/helpers/formatters"

interface GalleryMediaProps {
  contents: ContentDto[]
  text: string
  price: number
  createdAt: Date
  isCreator: boolean
  purchased: boolean
}

export const GalleryMedia: FC<GalleryMediaProps> = ({
  contents,
  text,
  price,
  createdAt,
  isCreator,
  purchased
}) => {
  const imgRef = useRef<HTMLImageElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openBuyPostModal, setOpenBuyPostModal] = useState<boolean>(false)
  const { images, video } = contentTypeCounter(contents)
  const [isLoadingStart, setIsLoadingStart] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const startLoadingHandler = () => () => setIsLoadingStart(true)
  // const [passHolder, setPassHolder] = useState<PassHolderDto>()
  const onLoadingHandler = () => {
    if (imgRef.current && imgRef.current.complete && setIsLoading) {
      setIsLoadingStart(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    onLoadingHandler()
  }, [isLoadingStart, setIsLoading, contents])
  return (
    <div className="flex w-full flex-col items-start gap-3 rounded-[15px] border border-white/20 bg-[#12070E]/50 p-4 sm:max-w-[265px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex cursor-pointer items-center justify-start gap-[6px]">
          <span className="text-[12px] font-medium leading-[22px] text-white">
            {purchased ? "Purchased" : "Pending"}
          </span>
          <div className="flex items-center gap-1">
            <span>
              <CostIcon />
            </span>
            <span className="text-[14px] font-bold leading-[25px] text-white/90">
              {price}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-[11px] font-medium uppercase leading-[12px] tracking-[1px] text-white opacity-50">
            <TimeAgo
              className="uppercase text-gray-300/60"
              date={createdAt ? createdAt : ""} // TODO: post.date}
              minPeriod={30}
            />
          </span>
        </div>
      </div>
      <div className="flex w-full">
        <p className="truncate text-[16px] font-medium leading-[22px] text-white hover:text-clip">
          {formatText(text)}
        </p>
      </div>
      {isCreator ? (
        <div className="relative flex h-full w-full cursor-pointer items-center justify-center">
          {contents.length === 1 ? (
            isLoading ? (
              <span>Please wait! Your content is being uploaded</span>
            ) : (
              purchased &&
              contents.map((c: ContentDto) => {
                if (c.contentType === ContentDtoContentTypeEnum.Image) {
                  return (
                    <img
                      alt=""
                      className="w-full rounded-[15px] object-cover shadow-xl"
                      key={c.contentId}
                      onLoad={startLoadingHandler}
                      ref={imgRef}
                      src={ContentService.userContentMediaPath(c)}
                    />
                  )
                } else if (c.contentType === ContentDtoContentTypeEnum.Video) {
                  return (
                    <VideoContent
                      content={{ content: c }}
                      fixedHeight
                      isActive={false}
                      key={c.contentId}
                    />
                  )
                } else {
                  console.error("Unsupported media type")
                }
              })
            )
          ) : contents.length > 1 ? (
            <div className="relative flex h-full w-full cursor-pointer items-center justify-center">
              <img
                alt=""
                className="w-full rounded-[15px] object-cover opacity-20 shadow-xl blur"
                key={contents[0].contentId}
                onLoad={startLoadingHandler}
                ref={imgRef}
                src={ContentService.userContentMediaPath(contents[0])}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="relative w-full bg-transparent">
          <div
            className={classNames(
              purchased ? "" : "bg-[#12070E]/50 backdrop-blur-[50px]",
              "absolute flex h-full w-full items-center justify-center rounded-[15px]"
            )}
          >
            {!purchased && (
              <div className="flex w-[245px] flex-col items-center">
                <ContentUnlockButton
                  className="max-w-[200px] gap-1 py-2 text-[14px]"
                  name={`Unlock For ${formatCurrency(price ?? 100)}`}
                  onClick={() => setOpenBuyPostModal(true)}
                  value={purchased.toString()}
                />
                {/* TODO: Replace with BuyMessageButton and BuyMessageModal from Destructure Priced Message PR */}
                <span className="flex items-center justify-center px-2 pt-4 text-white">
                  <UnlockText images={images} videos={video} />
                </span>
              </div>
            )}
          </div>
          <div className="relative flex h-full w-full cursor-pointer items-center justify-center">
            {contents.length === 1 ? (
              isLoading ? (
                <span>Please wait! Your content is being uploaded</span>
              ) : (
                contents.map((c: ContentDto) => {
                  if (c.contentType === ContentDtoContentTypeEnum.Image) {
                    return (
                      <div
                        className="relative flex h-full w-full cursor-pointer items-center justify-center"
                        key={c.contentId}
                      >
                        <img
                          alt=""
                          className="w-full rounded-[15px] object-cover opacity-20 shadow-xl blur"
                          key={c.contentId}
                          onLoad={startLoadingHandler}
                          ref={imgRef}
                          src={ContentService.userContentMediaPath(c)}
                        />
                      </div>
                    )
                  } else if (
                    c.contentType === ContentDtoContentTypeEnum.Video
                  ) {
                    return (
                      <VideoContent
                        content={{ content: c }}
                        fixedHeight
                        isActive={false}
                        key={c.contentId}
                      />
                    )
                  } else {
                    console.error("Unsupported media type")
                  }
                })
              )
            ) : contents.length > 1 ? (
              <div className="relative flex h-full w-full cursor-pointer items-center justify-center">
                <img
                  alt=""
                  className="w-full rounded-[15px] object-cover opacity-20 shadow-xl blur"
                  key={contents[0].contentId}
                  onLoad={startLoadingHandler}
                  ref={imgRef}
                  src={ContentService.userContentMediaPath(contents[0])}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
