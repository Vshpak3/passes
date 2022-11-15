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
      {showUnlock && "Unlock"} {!!videos && `${videos} videos,`}
      {!!images && plural("photo", images)}
    </span>
  )
}
