import { FC } from "react"

import { plural } from "src/helpers/plural"

interface UnlockTextProps {
  images: number
  videos: number
  showUnlock?: boolean
  className?: string
}

export const UnlockText: FC<UnlockTextProps> = ({
  images,
  videos,
  showUnlock = true,
  className = ""
}) => {
  return (
    <span className={className}>
      {showUnlock && "Unlock"} {!!videos && plural("video", videos)}
      {!!images && (videos ? ", " : "") + plural("photo", images)}
    </span>
  )
}
