import UploadIcon from "public/icons/upload.svg"
import { useState } from "react"
import { File } from "src/components/atoms"
import { MAX_IMAGE_COUNT } from "src/components/organisms/profile/main-content/new-post"
import {
  FileAccept,
  FormErrors,
  FormName,
  FormOptions,
  FormRegister
} from "src/components/types/FormTypes"

type DragDropFileProps = {
  name: FormName
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  className?: string
  accept?: FileAccept
  multiple?: boolean
}

const DragDropFile = ({
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
      if (options.onChange) {
        options.onChange(event)
      }
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
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-solid border-passes-secondary-color p-1">
        <UploadIcon />
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex gap-1">
            <File
              className="cursor-pointer "
              errors={errors}
              name={name}
              options={options}
              register={register}
              multiple={multiple}
              accept={accept}
              trigger={
                <span className="text-sm font-medium text-passes-secondary-color">
                  Click to upload
                </span>
              }
            />
            <span className="text-sm font-normal text-[#888689]">
              or drag and drop
            </span>
          </div>
          <p className="self-stretch text-center text-sm font-normal text-[#888689]">
            You may upload 1 video or up to {MAX_IMAGE_COUNT} photos per post
          </p>
          <p className="self-stretch text-center text-sm font-normal text-[#888689]">
            If no media is selected,{" "}
            <span className="text-passes-secondr-pointer cursor-pointer text-sm font-medium">
              Passes will provide a default art piece.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DragDropFile
