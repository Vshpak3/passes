import { ContentDto } from "@passes/api-client"
import { MouseEvent, useState } from "react"
import { toast } from "react-toastify"

import {
  MAX_FILE_COUNT,
  MAX_IMAGE_SIZE,
  MAX_IMAGE_SIZE_NAME,
  MAX_VIDEO_SIZE,
  MAX_VIDEO_SIZE_NAME
} from "src/config/media-limits"

export class ContentFile {
  file?: File
  content?: ContentDto

  constructor(file?: File, content?: ContentDto) {
    this.file = file
    this.content = content
  }
}

export const useMedia = (initFiles?: ContentFile[]) => {
  const [files, setFiles] = useState<ContentFile[]>(initFiles ?? [])

  const onRemove = (index: number, e: MouseEvent<HTMLDivElement>) => {
    const newFiles = files.filter((_, i) => i !== index)
    e.stopPropagation()
    setFiles(newFiles)
  }
  const addNewMedia = (_newFiles: FileList | null) => {
    if (!_newFiles) {
      return
    }
    const newFiles = Array.from(_newFiles)
    // Validate properties of each file
    for (const file of newFiles) {
      const type = (file.type.match(/(\w+)\/(\w+)/) ?? [])[1]
      if (!type || (type !== "image" && type !== "video")) {
        toast.error(`Invalid media type ${file.type}`)
        return
      }

      if (newFiles.length + files.length > MAX_FILE_COUNT) {
        toast.error(
          `Can only have a maximum of ${MAX_FILE_COUNT} pictures/videos`
        )
        return
      }

      if (type === "video" && file.size > MAX_VIDEO_SIZE) {
        toast.error(`Videos cannot be larger than ${MAX_VIDEO_SIZE_NAME}`)
        return
      }

      if (type === "image" && file.size > MAX_IMAGE_SIZE) {
        toast.error(`Images cannot be larger than ${MAX_IMAGE_SIZE_NAME}`)
        return
      }
    }

    setFiles([
      ...files,
      ...newFiles.map((newFile) => new ContentFile(newFile, undefined))
    ])
  }

  const addContent = (contents: ContentDto[]) => {
    setFiles((files) => [
      ...files,
      ...contents.map((content) => new ContentFile(undefined, content))
    ])
  }
  return { files, setFiles, addNewMedia, onRemove, addContent }
}
