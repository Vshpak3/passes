import type { FileAccept } from "src/components/atoms/input/FileInput"

export const MAX_FILE_COUNT = 40

const MB = 1048576
export const MAX_IMAGE_SIZE = 100 * MB
export const MAX_IMAGE_SIZE_NAME = "100 megabytes"
export const MAX_VIDEO_SIZE = 2000 * MB
export const MAX_VIDEO_SIZE_NAME = "2 gigabytes"

export const ACCEPTED_MEDIA_TYPES: FileAccept = [
  ".png",
  ".jpg",
  ".jpeg",
  ".mp4",
  ".mov"
  // ".qt"
  // ".mp3"
]
