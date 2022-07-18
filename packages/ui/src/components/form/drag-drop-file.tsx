import UploadIcon from "public/icons/upload.svg"
import { useState } from "react"

import { File } from "./file"
import {
  FileAccept,
  FormErrors,
  FormName,
  FormOptions,
  FormRegister
} from "./types"

type DragDropFileProps = {
  name: FormName
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  className?: string
  accept?: FileAccept
  multiple?: boolean
}

export const DragDropFile = ({
  name,
  options = {},
  register,
  errors = {},
  multiple,
  className,
  accept
}: DragDropFileProps) => {
  const [dragActive, setDragActive] = useState(false)
  const { onChange, onBlur, name: registerName, ref } = register(name, options)

  // handle drag events
  const handleDrag = function (event: any) {
    event.preventDefault()
    event.stopPropagation()
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true)
    } else if (event.type === "dragleave") {
      setDragActive(false)
    }
  }

  // triggers when file is dropped
  const handleDrop = function (event: any) {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      event.target.files = event.dataTransfer.files
      onChange(event)
      onBlur(event)
      if (options.onChange) options.onChange(event)
    }
  }

  return (
    <div className={className} onDragEnter={handleDrag}>
      <input
        type="file"
        name={registerName}
        ref={ref}
        className="hidden"
        multiple={multiple}
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
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-dashed border-[#BF7AF0] p-1">
        <UploadIcon />
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="flex gap-1">
            <File
              className="cursor-pointer "
              errors={errors}
              name={`dropbox-input-${name}`}
              options={options}
              register={register}
              multiple={multiple}
              accept={accept}
              trigger={
                <span className="text-[#BF7AF0]">Click here to upload</span>
              }
            />
            <span>or drag and drop</span>
          </p>
          <p>You may upload video or up to 9 photos per post</p>
        </div>
      </div>
    </div>
  )
}
