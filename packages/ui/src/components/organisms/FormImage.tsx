import React, { FC, useState } from "react"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"

import { File } from "src/components/atoms/File"
import { ImageCropDialog } from "src/components/organisms/ImageCropDialog"

interface FormImageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>
  name: string
  imgData: File[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>
  inputUI: JSX.Element
  cropWidth: number
  cropHeight: number
}

export const FormImage: FC<FormImageProps> = ({
  register,
  name,
  imgData,
  setValue,
  inputUI,
  cropWidth,
  cropHeight
}) => {
  const [imageCropOpen, setImageCropOpen] = useState(false)

  const onCrop = (croppedImage: File) => {
    setValue(name, [croppedImage], { shouldValidate: true })
    setImageCropOpen(false)
  }

  return (
    <>
      {imageCropOpen && imgData?.length && (
        <ImageCropDialog
          onCrop={onCrop}
          onClose={() => setImageCropOpen(false)}
          width={cropWidth}
          height={cropHeight}
          src={URL.createObjectURL(imgData[0])}
        />
      )}
      <File
        accept={["image"]}
        register={register}
        name={name}
        options={{ onChange: () => setImageCropOpen(true) }}
        trigger={inputUI}
      />
    </>
  )
}
