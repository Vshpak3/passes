import React, { FC, useRef } from "react"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister
} from "src/components/atoms/input/InputTypes"
import { Label } from "src/components/atoms/Label"

export type FileAccept = Array<"audio" | "image" | "video" | `.${string}`>

type FileInputProps = {
  label?: FormLabel
  name: FormName
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  placeholder?: FormPlaceholder
  multiple?: boolean
  accept?: FileAccept
  trigger?: JSX.Element
  className?: string
  onBlur?: (event: Event) => void
}

const acceptProp = (accept?: FileAccept) =>
  accept?.reduce((acc, type) => {
    switch (type) {
      case "audio":
      case "image":
      case "video":
        acc += type + "/*"
        break
      default:
        acc += type
        break
    }
    acc += ","
    return acc
  }, "")

export const FileInput: FC<FileInputProps> = ({
  name,
  label,
  register,
  errors = {},
  options = {},
  multiple,
  accept,
  trigger,
  className,
  onBlur,
  ...rest
}) => {
  const uploadRef = useRef<HTMLInputElement | null>(null)
  const { ref, ...reg } = register(name, options)

  const onClick = () => {
    uploadRef.current?.click()
  }
  return (
    <>
      {!!label && (
        <Label errors={errors} label={label} name={name} options={options} />
      )}
      <div className={className}>
        <input
          accept={acceptProp(accept)}
          className="hidden"
          multiple={multiple}
          onBlur={onBlur}
          ref={(r) => {
            ref(r)
            uploadRef.current = r
          }}
          type="file"
          {...reg}
          {...rest}
        />
        <span onClick={onClick}>{trigger}</span>
      </div>
    </>
  )
}
