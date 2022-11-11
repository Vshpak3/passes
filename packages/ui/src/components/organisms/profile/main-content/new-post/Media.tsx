import { ContentDtoContentTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import DeleteIcon from "public/icons/media-delete-icon.svg"
import PlayIcon from "public/icons/media-play-circle-icon.svg"
import { FC, MouseEventHandler } from "react"

import { Cross } from "src/icons/CrossIcon"

type MediaProp = {
  src: string
  type: ContentDtoContentTypeEnum
  className?: string
  iconClassName?: string
  onRemove?: MouseEventHandler
  onSelect?: MouseEventHandler
  preview?: boolean
  contentHeight?: number
  contentWidth?: number
  isPassUpload?: boolean
  objectFit?: NonNullable<JSX.IntrinsicElements["img"]["style"]>["objectFit"]
  noRender?: boolean
  noRenderString?: string
}

export const Media: FC<MediaProp> = ({
  src,
  type,
  className,
  iconClassName,
  onRemove,
  onSelect,
  preview,
  contentHeight,
  contentWidth,
  isPassUpload,
  objectFit = "cover",
  noRender,
  noRenderString
}) => {
  const media: Partial<{ [key in ContentDtoContentTypeEnum]: JSX.Element }> = {
    video: (
      <>
        {noRender ? (
          <div className="flex w-[200px] flex-col items-center justify-center rounded-[6px] border border-white/20 bg-black">
            <div />
            <PlayIcon />
            <span>
              {noRenderString
                ? noRenderString.substring(0, 15) + "..."
                : "Video"}
            </span>
          </div>
        ) : (
          <video
            className="select-none"
            controls
            controlsList="nodownload"
            src={src}
            style={{ width: contentWidth, height: contentHeight }}
          />
        )}
        {!preview && (
          <div
            className={classNames(
              iconClassName,
              "z-[5] h-[24px] w-[24px] cursor-pointer "
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
            maxHeight: contentHeight || "fit-content",
            maxWidth: contentWidth || "fit-content"
          }}
        />
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
              <Cross className="h-full w-full" />
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
            <Cross className="h-full w-full" />
          </div>
        )}
      </>
    )
  }
  return media[type] ?? null
}
