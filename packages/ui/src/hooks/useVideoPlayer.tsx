import { useRef } from "react"

export const useVideoPlayer = () => {
  const ref = useRef<HTMLVideoElement>(null)
  const pause = () => {
    ref.current?.pause()
  }
  return {
    ref,
    pause
  }
}
