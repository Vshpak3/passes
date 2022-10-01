import classNames from "classnames"
import { useEffect, useRef } from "react"

import { useReactMediaRecorder } from "./recorder"

export const RecordView = ({
  onStop,
  onStart,
  options = { video: true, askPermissionOnMount: true },
  className = ""
}: any) => {
  const { status, startRecording, stopRecording, previewStream } =
    useReactMediaRecorder({
      ...options,
      onStop: (blobUrl, blobObject) => {
        if (onStop) {
          onStop(blobUrl, blobObject, options.video)
        }
      },
      onStart
    })

  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && previewStream) {
      ;(videoRef.current as any).srcObject = previewStream
    }
  }, [previewStream, videoRef])

  return (
    <div className={classNames(className)}>
      <div className="absolute bottom-10 z-20 flex w-full items-center justify-center">
        <span
          className="flex cursor-pointer  rounded-full border-4 border-[#ffff]/30 p-[2px]"
          onClick={() =>
            status === "idle"
              ? startRecording()
              : status === "recording"
              ? stopRecording()
              : null
          }
        >
          <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#fff]">
            {status === "idle" || status === "acquiring_media" ? (
              <span className="inline-block h-5 w-5 rounded-full bg-red-500"></span>
            ) : status === "recording" ? (
              <span className="inline-block h-4 w-4 rounded-none bg-red-500"></span>
            ) : null}
          </span>
        </span>
      </div>
      {previewStream && status !== "stopped" && options.video && (
        <video
          ref={videoRef}
          className={classNames(
            status === "idle" ? "opacity-60" : "",
            "z-10 h-full w-full object-contain"
          )}
          autoPlay
        />
      )}
    </div>
  )
}
