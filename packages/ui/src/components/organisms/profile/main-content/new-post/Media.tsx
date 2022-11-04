import { ContentDtoContentTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import DeleteIcon from "public/icons/media-delete-icon.svg"
import React, { FC, MouseEventHandler } from "react"

import { Cross } from "src/icons/CrossIcon"

type MediaFileProp = {
  file: File
  className?: string
  iconClassName?: string
  onRemove?: MouseEventHandler
  onSelect?: MouseEventHandler
  preview?: boolean
  contentHeight?: number
  contentWidth?: number
  isPassUpload?: boolean
  objectFit?: NonNullable<JSX.IntrinsicElements["img"]["style"]>["objectFit"]
}

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
}

export const MediaFile: FC<MediaFileProp> = ({
  file,
  className,
  iconClassName,
  onRemove,
  onSelect,
  preview,
  contentHeight,
  contentWidth,
  isPassUpload,
  objectFit
}) => {
  const src = URL.createObjectURL(file)
  let type!: ContentDtoContentTypeEnum
  if (file.type.startsWith("image/")) {
    type = "image"
  }
  if (file.type.startsWith("video/")) {
    type = "video"
  }
  if (file.type.startsWith("audio/")) {
    type = "audio"
  }
  return (
    <Media
      className={className}
      contentHeight={contentHeight}
      contentWidth={contentWidth}
      iconClassName={iconClassName}
      isPassUpload={isPassUpload}
      objectFit={objectFit}
      onRemove={onRemove}
      onSelect={onSelect}
      preview={preview}
      src={src}
      type={type}
    />
  )
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
  objectFit = "cover"
}) => {
  const media: Partial<{ [key in ContentDtoContentTypeEnum]: JSX.Element }> = {
    video: (
      <>
        <video
          className="video-js"
          controls
          src={src}
          style={{ width: contentWidth, height: contentHeight }}
        />
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
          src={src}
          style={{
            objectFit,
            height: contentHeight || "fit-content",
            width: contentWidth || "fit-content"
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
