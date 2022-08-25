import { useCallback, useState } from "react"
import Cropper from "react-easy-crop"

import { Button } from "../atoms"
import Dialog from "./Dialog"

type CroppedArea = {
  x: number
  y: number
  width: number
  height: number
}

type ImageCropDialogProp = {
  onCrop: (result: File) => void
  onClose: () => void
  src: string
  height: number
  width: number
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.src = url
  })

async function getCroppedImg(
  imageSrc: string,
  croppedArea: CroppedArea,
  width: number,
  height: number
): Promise<File> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

  // set canvas width to final desired crop size
  canvas.width = width
  canvas.height = height

  ctx.drawImage(
    image,
    // start at the cropped x (left) and y (top) position of the image
    croppedArea.x,
    croppedArea.y,
    // get the cropped area width and height from the source image
    croppedArea.width,
    croppedArea.height,
    // place the result at top 0, left 0 position in the result canvas
    0,
    0,
    // scale the result to given width and height, aspect ratio will always be the same
    width,
    height
  )

  // As a file
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(
        new File([blob as Blob], "image.jpeg", {
          lastModified: new Date().getTime(),
          type: blob?.type
        })
      )
    }, "image/jpeg")
  })
}

export const ImageCropDialog = ({
  onCrop,
  onClose,
  src,
  height,
  width
}: ImageCropDialogProp) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<CroppedArea>({
    x: 0,
    y: 0,
    width,
    height
  })

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: CroppedArea) => {
      setCroppedArea(croppedAreaPixels)
    },
    []
  )

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(src, croppedArea, width, height)
      onCrop(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedArea, src, height, width, onCrop])

  return (
    <Dialog
      className="flex h-[90vh] w-screen transform flex-col items-start justify-start border border-[#ffffff]/10 bg-[#0c0609] px-[29px] pt-[37px] transition-all md:max-w-[544px] md:rounded-[20px]"
      open={true}
      title={
        <div className="flex justify-between bg-[#0c0609] pb-4">
          <Button
            onClick={onClose}
            className="!px-6 !py-4 font-medium sm:!px-12"
            variant="primary"
            fontSize={15}
          >
            Back
          </Button>
          <Button
            onClick={showCroppedImage}
            className="!px-6 !py-5 font-medium sm:!px-12 sm:!py-4"
            variant="gradient"
            fontSize={15}
          >
            Save
          </Button>
        </div>
      }
      footer={
        <div className="left-20 -mb-4 bg-inherit !bg-[#0c0609] p-4">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(Number(e.target.value))
            }}
            className="zoom-range w-full max-w-[300px]"
          />
        </div>
      }
    >
      <div className="relative h-full">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={width / height}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          showGrid={false}
        />
      </div>
    </Dialog>
  )
}
