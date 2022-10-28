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
      src={src}
      type={type}
      className={className}
      onRemove={onRemove}
      onSelect={onSelect}
      preview={preview}
      iconClassName={iconClassName}
      contentHeight={contentHeight}
      contentWidth={contentWidth}
      isPassUpload={isPassUpload}
      objectFit={objectFit}
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
  contentHeight = 200,
  contentWidth = 200,
  isPassUpload,
  objectFit = "cover"
}) => {
  const media: Partial<{ [key in ContentDtoContentTypeEnum]: JSX.Element }> = {
    video: (
      <>
        <video
          style={{ width: contentWidth, height: contentHeight }}
          className="video-js"
          controls
          src={src}
        />
        {!preview && (
          <div
            onClick={onRemove}
            className={classNames(
              iconClassName,
              "z-[5] h-[24px] w-[24px] cursor-pointer "
            )}
          >
            <DeleteIcon className="h-full w-full" />
          </div>
        )}
      </>
    ),
    image: (
      <>
        <img
          className={className}
          alt=""
          src={src}
          style={{ objectFit, height: contentHeight, width: contentWidth }}
        />
        {!preview && (
          <div
            onClick={onRemove}
            className={classNames(
              "z-[5] h-[24px] w-[24px] cursor-pointer",
              isPassUpload &&
                "bottom-[180px] left-[100px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-passes-secondary-color p-2 text-white",
              iconClassName
            )}
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
          src={src}
          className={className}
          onClick={onSelect}
          preload="auto"
          controls
        />
        {!preview && (
          <div
            onClick={onRemove}
            className="relative top-1 left-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(0,0,0,0.75)] p-2 text-white"
          >
            <Cross className="h-full w-full" />
          </div>
        )}
      </>
    )
  }
  return media[type] ?? null
}
