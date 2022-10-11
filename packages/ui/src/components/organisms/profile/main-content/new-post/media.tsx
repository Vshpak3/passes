import { ContentDtoContentTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import Image from "next/image"
import DeleteIcon from "public/icons/media-delete-icon.svg"
import { Cross } from "src/icons/cross"

type MediaFileProp = {
  file: File
  className?: string
  iconClassName?: string
  onRemove?: any
  onSelect?: any
  preview?: boolean
  contentHeight?: number
  contentWidth?: number
}

type MediaProp = {
  src: string
  type: ContentDtoContentTypeEnum
  className?: string
  iconClassName?: string
  onRemove?: any
  onSelect?: any
  preview?: boolean
  contentHeight?: number
  contentWidth?: number
}

export const MediaFile = ({
  file,
  className,
  iconClassName,
  onRemove,
  onSelect,
  preview,
  contentHeight,
  contentWidth
}: MediaFileProp) => {
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
    />
  )
}

export const Media = ({
  src,
  type,
  className,
  iconClassName,
  onRemove,
  onSelect,
  preview,
  contentHeight = 300,
  contentWidth = 300
}: MediaProp) => {
  const media: Partial<{ [key in ContentDtoContentTypeEnum]: JSX.Element }> = {
    video: (
      <>
        <video className={className} onClick={onSelect} src={src} controls />
        {!preview && (
          <div
            onClick={onRemove}
            className="relative bottom-[140px] left-[110px] z-[1] flex h-8 w-8 cursor-pointer items-center justify-center"
          >
            <DeleteIcon className="h-full w-full" />
          </div>
        )}
      </>
    ),
    image: (
      <div className="relative left-[-30px]" onClick={onSelect}>
        <Image
          className={className}
          alt=""
          layout="fixed"
          width={`${contentWidth}px`}
          height={`${contentHeight}px`}
          src={src}
          objectFit="contain"
        />
        {!preview && (
          <div
            onClick={onRemove}
            className={classNames(
              "relative bottom-[235px] left-[210px] z-[5] h-[24px] w-[24px] cursor-pointer",
              iconClassName
            )}
          >
            <DeleteIcon className="h-full w-full" />
          </div>
        )}
      </div>
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
