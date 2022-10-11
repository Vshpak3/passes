import React, { FC, useState } from "react"
import { UseFormRegister, UseFormSetValue } from "react-hook-form"
import { FormInput } from "src/components/atoms/FormInput"
import { ImageCropDialog } from "src/components/organisms/ImageCropDialog"

interface FormImageProps {
  register: UseFormRegister<any>
  name: string
  imgData: File[]
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
      <FormInput
        type="file"
        accept={["image"]}
        register={register}
        name={name}
        options={{ onChange: () => setImageCropOpen(true) }}
        trigger={inputUI}
      />
    </>
  )
}
