import "video.js/dist/video-js.css"
import React, { FC, forwardRef, LegacyRef } from "react"

type VideRefType = LegacyRef<HTMLVideoElement> | undefined

export const Video: FC = forwardRef<HTMLVideoElement, unknown>((_, ref) => {
  return (
    <div data-vjs-player>
      <video
        // TODO: fix this
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className="video-js vjs-big-play-centered"
        muted
        ref={ref as VideRefType}
      />
    </div>
  )
})

Video.displayName = "Video"
