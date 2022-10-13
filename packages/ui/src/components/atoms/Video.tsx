import "video.js/dist/video-js.css"

import React, { FC, forwardRef, LegacyRef } from "react"

type VideRefType = LegacyRef<HTMLVideoElement> | undefined

type Props = unknown

const inlineStylesForPlayerJs = `
  .video-js .vjs-big-play-button {
    background: rgba(21, 21, 21, 0.85);
    height: 76px;
    width: 110px;
    border: none;
    border-radius: 25px;
    opacity: 0.8;
  }
  .video-js .vjs-big-play-button .vjs-icon-placeholder:before {
    padding-top: 16px;
    font-size: 44px;
    height: 76px;
    width: 110px;
  }`

export const Video: FC = forwardRef<HTMLVideoElement, Props>((_, ref) => {
  return (
    <div data-vjs-player>
      <style>{inlineStylesForPlayerJs}</style>
      <video
        muted
        ref={ref as VideRefType}
        className="video-js vjs-big-play-centered"
      />
    </div>
  )
})

Video.displayName = "Video"
