import UploadIcon from "public/icons/upload.svg"
import { DragEvent, FC } from "react"

import { DragDrop } from "src/components/atoms/DragDrop"
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
  const { onChange, onBlur, name: registerName, ref } = register(name, options)

  const _onChange = function (event: DragEvent<HTMLDivElement>) {
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
    <DragDrop className={className} onChange={_onChange}>
      <>
        <input
          className="hidden"
          multiple={multiple}
          name={registerName}
          ref={ref}
          type="file"
        />
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
            {!!helperText && (
              <p className="self-stretch text-center font-normal">
                {helperText}
              </p>
            )}
          </div>
        </div>
      </>
    </DragDrop>
  )
}
