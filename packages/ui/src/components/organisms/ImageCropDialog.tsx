import { FC, useCallback, useState } from "react"
import Cropper, { Area } from "react-easy-crop"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/Button"
import { Dialog } from "./Dialog"

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
    image.addEventListener("error", reject)
    image.src = url
  })

async function getCroppedImg(
  imageSrc: string,
  croppedArea: CroppedArea
): Promise<File> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

  // set canvas width to final desired crop size
  canvas.width = croppedArea.width
  canvas.height = croppedArea.height

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
    croppedArea.width,
    croppedArea.height
  )

  // As a file
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(
        new File([blob as Blob], "image.jpeg", {
          lastModified: Date.now(),
          type: blob?.type
        })
      )
    }, "image/jpeg")
  })
}

export const ImageCropDialog: FC<ImageCropDialogProp> = ({
  onCrop,
  onClose,
  src,
  height,
  width
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<CroppedArea>({
    x: 0,
    y: 0,
    width,
    height
  })

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: CroppedArea) => {
      setCroppedArea(croppedAreaPixels)
    },
    []
  )

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(src, croppedArea)
      onCrop(croppedImage)
    } catch (e: unknown) {
      console.error(e)
      toast.error(e as string)
    }
  }, [croppedArea, src, onCrop])

  return (
    <Dialog
      className="flex h-[90vh] w-screen flex-col items-start justify-start border border-[#ffffff]/10 bg-[#0c0609] px-[29px] pt-[37px] transition-all md:max-w-[544px] md:rounded-[15px]"
      footer={
        <div className="left-20 -mb-4 bg-inherit p-4">
          <input
            aria-labelledby="Zoom"
            className="w-full max-w-[300px]"
            max={3}
            min={1}
            onChange={(e) => {
              setZoom(Number(e.target.value))
            }}
            step={0.1}
            type="range"
            value={zoom}
          />
        </div>
      }
      open
      title={
        <div className="flex justify-between bg-[#0c0609] pb-4">
          <Button
            className="!px-6 !py-4 font-medium sm:!px-12"
            fontSize={15}
            onClick={onClose}
            variant="primary"
          >
            Back
          </Button>
          <Button
            className="!px-6 !py-5 font-medium sm:!px-12 sm:!py-4"
            fontSize={15}
            onClick={showCroppedImage}
            variant="gradient"
          >
            Save
          </Button>
        </div>
      }
    >
      <div className="relative h-full">
        <Cropper
          aspect={width / height}
          crop={crop}
          image={src}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          showGrid={false}
          zoom={zoom}
        />
      </div>
    </Dialog>
  )
}
