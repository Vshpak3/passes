import { useEffect, useRef } from "react"

import { classNames } from "../../../helpers/classNames"
import { useReactMediaRecorder } from "./recorder"

export const RecordView = ({
  onStop,
  onStart,
  options = { video: true, askPermissionOnMount: true },
  className = ""
}) => {
  const { status, startRecording, stopRecording, previewStream } =
    useReactMediaRecorder({
      ...options,
      onStop: (blobUrl, blobObject) => {
        if (onStop) onStop(blobUrl, blobObject, options.video)
      },
      onStart
    })

  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream
    }
  }, [previewStream, videoRef])

  return (
    <div className={classNames("relative", className)}>
      <div className="absolute bottom-10 z-20 flex w-full items-center justify-center">
        <p>{status}</p>
        <button className="" onClick={startRecording}>
          Start Recording
        </button>
        <button className="" onClick={stopRecording}>
          Stop Recording
        </button>
      </div>

      {previewStream && status !== "stopped" && options.video && (
        <video
          ref={videoRef}
          className="z-10 h-full w-full object-contain"
          autoPlay
        />
      )}
    </div>
  )
}
