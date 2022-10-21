import { FileAccept } from "src/components/types/FormTypes"

export const MAX_FILE_COUNT = 20

const MB = 1048576
export const MAX_FILE_SIZE = 10 * MB
export const MAX_FILES = 9

export const ACCEPTED_MEDIA_TYPES: FileAccept = [
  ".png",
  ".jpg",
  ".jpeg",
  ".mp4",
  ".mov"
  // ".qt"
  // ".mp3"
]
