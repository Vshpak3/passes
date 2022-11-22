import { useEffect, useRef, useState } from "react"

export const useVideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  const pause = () => {
    ref.current?.pause()
  }
  const play = () => {
    ref.current?.play()
  }
  useEffect(() => {
    const callback = () => {
      setIsPlaying(!ref.current?.paused)
    }
    const videoRef = ref.current
    if (videoRef) {
      videoRef.addEventListener("play", callback)
      videoRef.addEventListener("pause", callback)
    }
    return () => {
      if (videoRef) {
        videoRef.removeEventListener("play", callback)
        videoRef.removeEventListener("pause", callback)
      }
    }
  }, [])

  return {
    ref,
    pause,
    play,
    isPlaying
  }
}
