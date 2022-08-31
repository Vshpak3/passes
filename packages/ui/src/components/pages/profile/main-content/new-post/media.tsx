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

export const MediaFile = ({
  file,
  className,
  onRemove,
  onSelect,
  preview
}: MediaFileProp) => {
  if (file.type.startsWith("video/"))
    return (
      <>
        <video
          className={className}
          onClick={onSelect}
          src={URL.createObjectURL(file)}
          width="0px"
          height="0px"
          controls
        />
        {!preview && (
          <div
            onClick={onRemove}
            className="absolute top-1 left-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(0,0,0,0.75)] p-2 text-white"
          >
            <Cross className="h-full w-full" />
          </div>
        )}
      </>
    )
  if (file.type.startsWith("image/"))
    return (
      <>
        {!preview && (
          <div
            onClick={() => onRemove()}
            className="relative top-1 left-1  mb-5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-passes-secondary-color p-2 text-white"
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
          src={URL.createObjectURL(file)}
          objectFit="contain"
        />
      </>
    )

  if (file.type.startsWith("audio/"))
    return (
      <>
        <audio
          src={URL.createObjectURL(file)}
          className={className}
          onClick={onSelect}
          preload="auto"
          controls
        />
        {!preview && (
          <div
            onClick={onRemove}
            className="absolute top-1 left-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(0,0,0,0.75)] p-2 text-white"
          >
            <Cross className="h-full w-full" />
          </div>
        )}
      </>
    )
  return null
}
