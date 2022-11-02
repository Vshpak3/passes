import type { FileAccept } from "src/components/atoms/input/FileInput"

export const MAX_FILE_COUNT = 20

const MB = 1048576
export const MAX_IMAGE_SIZE = 10 * MB
export const MAX_IMAGE_SIZE_NAME = "10 megabytes"
export const MAX_VIDEO_SIZE = 200 * MB
export const MAX_VIDEO_SIZE_NAME = "200 megabytes"

export const ACCEPTED_MEDIA_TYPES: FileAccept = [
  ".png",
  ".jpg",
  ".jpeg",
  ".mp4",
  ".mov"
  // ".qt"
  // ".mp3"
]
