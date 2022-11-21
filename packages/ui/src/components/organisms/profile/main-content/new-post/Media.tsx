import { ContentDtoContentTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import ExpandIcon from "public/icons/expand-03.svg"
import DeleteIcon from "public/icons/media-delete-icon.svg"
import PlayIcon from "public/icons/media-play-circle-icon.svg"
import { FC, MouseEventHandler } from "react"

import { VideoPlayer } from "src/components/atoms/content/VideoPlayer"
import { useVideoPlayer } from "src/hooks/useVideoPlayer"
import { CrossIcon } from "src/icons/CrossIcon"

type MediaProp = {
  src: string
  type: ContentDtoContentTypeEnum
  className?: string
  iconClassName?: string
  onRemove?: MouseEventHandler
  onSelect?: MouseEventHandler
  onExpand?: MouseEventHandler
  preview?: boolean
  contentHeight?: number
  contentWidth?: number
  isPassUpload?: boolean
  objectFit?: NonNullable<JSX.IntrinsicElements["img"]["style"]>["objectFit"]
  noRender?: boolean
  poster?: string
  noRenderString?: string
}

export const Media: FC<MediaProp> = ({
  src,
  type,
  className,
  iconClassName,
  onRemove,
  onSelect,
  onExpand,
  preview,
  contentHeight,
  contentWidth,
  isPassUpload,
  objectFit = "cover",
  noRender,
  poster,
  noRenderString
}) => {
  const fitContent = "fit-content"
  const { ref } = useVideoPlayer()

  const media: Partial<{ [key in ContentDtoContentTypeEnum]: JSX.Element }> = {
    video: (
      <>
        {noRender ? (
          <div className="flex w-[200px] cursor-pointer flex-col items-center justify-center rounded-[6px] border border-white/20 bg-black">
            <div />
            <PlayIcon />
            <span>
              {noRenderString
                ? noRenderString.substring(0, 15) + "..."
                : "Video"}
            </span>
          </div>
        ) : (
          <VideoPlayer
            autoplay={false}
            className="relative z-20 inline-block h-auto max-h-full max-w-full object-contain"
            poster={poster}
            ref={ref}
            src={src}
          />
        )}
        {onExpand && (
          <div className="absolute top-[5px] right-[55px] z-[100] h-[24px] w-[24px] cursor-pointer mix-blend-difference md:right-[140px]">
            <ExpandIcon classname="h-full w-full" onClick={onExpand} />
          </div>
        )}
        {!preview && (
          <div
            className={classNames(
              iconClassName,
              "z-[5] h-[24px] w-[24px] cursor-pointer"
            )}
            onClick={onRemove}
          >
            <DeleteIcon className="h-full w-full" />
          </div>
        )}
      </>
    ),
    image: (
      <>
        <img
          alt=""
          className={className}
          onClick={onSelect}
          src={src}
          style={{
            objectFit,
            maxHeight: contentHeight || fitContent,
            maxWidth: contentWidth || fitContent
          }}
        />
        {onExpand && (
          <div className="absolute top-[5px] right-[55px] z-[100] h-[24px] w-[24px] cursor-pointer mix-blend-difference md:right-[140px]">
            <ExpandIcon classname="h-full w-full" onClick={onExpand} />
          </div>
        )}
        {!preview && (
          <div
            className={classNames(
              "z-[5] h-[24px] w-[24px] cursor-pointer",
              isPassUpload &&
                "bottom-[180px] left-[100px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-passes-secondary-color p-2 text-white",
              iconClassName
            )}
            onClick={onRemove}
          >
            {isPassUpload ? (
              <CrossIcon className="h-full w-full" />
            ) : (
              <DeleteIcon className="h-full w-full" />
            )}
          </div>
        )}
      </>
    ),
    audio: (
      <>
        <audio
          className={className}
          controls
          onClick={onSelect}
          preload="auto"
          src={src}
        />
        {!preview && (
          <div
            className="relative top-1 left-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(0,0,0,0.75)] p-2 text-white"
            onClick={onRemove}
          >
            <CrossIcon className="h-full w-full" />
          </div>
        )}
      </>
    )
  }
  return media[type] ?? null
}
