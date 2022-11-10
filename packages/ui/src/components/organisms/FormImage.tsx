import React, { FC, useState } from "react"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"

import { FileInput } from "src/components/atoms/input/FileInput"
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
      {imageCropOpen && !!imgData?.length && (
        <ImageCropDialog
          height={cropHeight}
          onClose={() => setImageCropOpen(false)}
          onCrop={onCrop}
          src={URL.createObjectURL(imgData[0])}
          width={cropWidth}
        />
      )}
      <FileInput
        accept={["image"]}
        name={name}
        options={{ onChange: () => setImageCropOpen(true) }}
        register={register}
        trigger={inputUI}
      />
    </>
  )
}
