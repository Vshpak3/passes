import { FC } from "react"

import { plural } from "src/helpers/plural"

interface UnlockTextProps {
  images: number
  videos: number
  showUnlock?: boolean
}

export const UnlockText: FC<UnlockTextProps> = ({
  images,
  videos,
  showUnlock = true
}) => {
  return (
    <>
      {showUnlock && "Unlock"} {!!videos && plural("video", videos)}
      {!!images && (videos ? ", " : "") + plural("photo", images)}
    </>
  )
}
