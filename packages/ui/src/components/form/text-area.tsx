import React from "react"
import { classNames } from "src/helpers/classNames"

import { Label } from "./label"
import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormRegister
} from "./types"

type TextAreaProps = {
  label?: FormLabel
  name: FormName
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  rows?: number
  className?: string
  placeholder?: string
}

export const TextArea = ({
  name,
  label,
  register,
  errors = {},
  options = {},
  className,
  rows = 5,
  placeholder,
  ...rest
}: TextAreaProps) => {
  return (
    <>
      {label && (
        <Label name={name} label={label} errors={errors} options={options} />
      )}
      <textarea
        placeholder={placeholder}
        name={name}
        rows={rows}
        {...register(name, options)}
        {...rest}
        className={classNames(
          errors[name] !== undefined ? "border-red-500" : "",
          "block w-full appearance-none px-3 py-2 placeholder-gray-300",
          className || ""
        )}
      />
    </>
  )
}
