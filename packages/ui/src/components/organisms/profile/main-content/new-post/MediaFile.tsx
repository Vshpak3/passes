import { ContentDtoContentTypeEnum } from "@passes/api-client"
import { FC, MouseEventHandler } from "react"

import { Media } from "./Media"

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
  noRender?: boolean
  noRenderString?: string
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
  objectFit,
  noRender,
  noRenderString
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
      noRender={noRender}
      noRenderString={noRenderString}
      objectFit={objectFit}
      onRemove={onRemove}
      onSelect={onSelect}
      preview={preview}
      src={src}
      type={type}
    />
  )
}
