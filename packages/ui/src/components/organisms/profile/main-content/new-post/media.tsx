import { ContentDtoContentTypeEnum } from "@passes/api-client"
import Image from "next/image"
import React from "react"
import Cross from "src/icons/cross"

type MediaFileProp = {
  file: File
  className?: string
  onRemove?: any
  onSelect?: any
  preview?: boolean
}

type MediaProp = {
  className?: string
  onRemove?: any
  onSelect?: any
  preview?: boolean
  src: string
  type: ContentDtoContentTypeEnum
}

export const MediaFile = ({
  file,
  className,
  onRemove,
  onSelect,
  preview
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
    />
  )
}

export const Media = ({
  src,
  type,
  className,
  onRemove,
  onSelect,
  preview
}: MediaProp) => {
  const media: Partial<{ [key in ContentDtoContentTypeEnum]: JSX.Element }> = {
    video: (
      <>
        <video
          className={className}
          onClick={onSelect}
          src={src}
          width="0px"
          height="0px"
          controls
        />
        {!preview && (
          <div
            onClick={onRemove}
            className="relative top-1 left-0 z-[1] flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(0,0,0,0.75)] p-2 text-white"
          >
            <Cross className="h-full w-full" />
          </div>
        )}
      </>
    ),
    image: (
      <>
        {!preview && (
          <div
            onClick={() => onRemove()}
            className="relative top-1 left-1 z-[1] mb-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-passes-secondary-color p-2 text-white"
          >
            <Cross className="h-full w-full" />
          </div>
        )}
        <Image
          className={className}
          alt=""
          layout="fixed"
          width="300px"
          height="300px"
          src={src}
          objectFit="contain"
        />
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
