import "video.js/dist/video-js.css"
import React, { FC, forwardRef, LegacyRef } from "react"

type VideRefType = LegacyRef<HTMLVideoElement> | undefined

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

export const Video: FC = forwardRef<HTMLVideoElement, unknown>((_, ref) => {
  return (
    <div data-vjs-player>
      <style>{inlineStylesForPlayerJs}</style>
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
