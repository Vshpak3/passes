import { FileAccept } from "src/components/types/FormTypes"

const MB = 1048576
export const MAX_FILE_SIZE = 10 * MB
export const MAX_FILES = 20

export const ACCEPTED_MEDIA_TYPES: FileAccept = [
  ".png",
  ".jpg",
  ".jpeg",
  ".mp4",
  ".mov"
  // ".qt"
  // ".mp3"
]
