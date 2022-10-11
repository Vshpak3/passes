import "video.js/dist/video-js.css"

import React, { FC, forwardRef, LegacyRef } from "react"

type VideRefType = LegacyRef<HTMLVideoElement> | undefined

type Props = unknown

export const Video: FC = forwardRef<HTMLVideoElement, Props>((_, ref) => {
  return (
    <div data-vjs-player>
      <video
        ref={ref as VideRefType}
        className="video-js vjs-big-play-centered"
      />
    </div>
  )
})

Video.displayName = "Video"
