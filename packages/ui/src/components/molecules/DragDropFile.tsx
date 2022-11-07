import UploadIcon from "public/icons/upload.svg"
import { DragEvent, FC, useState } from "react"

import { FileAccept, FileInput } from "src/components/atoms/input/FileInput"
import {
  FormErrors,
  FormName,
  FormOptions,
  FormRegister
} from "src/components/atoms/input/InputTypes"

type DragDropFileProps = {
  name: FormName
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  className?: string
  accept?: FileAccept
  multiple?: boolean
  helperText?: string
}

export const DragDropFile: FC<DragDropFileProps> = ({
  name,
  options = {},
  register,
  errors = {},
  multiple,
  className,
  accept,
  helperText
}) => {
  const [dragActive, setDragActive] = useState(false)
  const { onChange, onBlur, name: registerName, ref } = register(name, options)

  // handle drag events
  const handleDrag = function (event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true)
    } else if (event.type === "dragleave") {
      setDragActive(false)
    }
  }

  // triggers when file is dropped
  const handleDrop = function (event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      event.target.files = event.dataTransfer.files
      onChange(event)
      onBlur(event)
      if (options.onChange) {
        options.onChange(event)
      }
    }
  }

  return (
    <div className={className} onDragEnter={handleDrag}>
      <input
        className="hidden"
        multiple={multiple}
        name={registerName}
        ref={ref}
        type="file"
      />
      {dragActive && (
        <div
          className="absolute inset-0 h-full w-full backdrop-brightness-125"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border-[1px] border-solid border-passes-secondary-color p-2 text-sm text-gray-500">
        <UploadIcon />
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex gap-1">
            <FileInput
              accept={accept}
              className="cursor-pointer"
              errors={errors}
              multiple={multiple}
              name={name}
              options={options}
              register={register}
              trigger={
                <span className="font-medium text-passes-secondary-color">
                  Click to upload
                </span>
              }
            />
            <span className="font-normal">or drag and drop</span>
          </div>
          {helperText && (
            <p className="self-stretch text-center font-normal">{helperText}</p>
          )}
          {/* {name === "passFile" ?? (
            <p className="self-stretch text-center font-normal">
              If no media is selected,{" "}
              <span className="cursor-pointer font-medium">
                Passes will provide a default art piece.
              </span>
            </p>
          )} */}
        </div>
      </div>
    </div>
  )
}
