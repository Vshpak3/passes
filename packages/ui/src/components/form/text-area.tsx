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
  cols?: number
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
  rows = 3,
  cols,
  placeholder,
  ...rest
}: TextAreaProps) => {
  return (
    <>
      {label && (
        <Label name={name} label={label} errors={errors} options={options} />
      )}
      <div className="mt-1">
        <textarea
          placeholder={placeholder}
          name={name}
          rows={rows}
          cols={cols}
          {...register(name, options)}
          {...rest}
          className={classNames(
            errors[name] !== undefined ? "border-red-500" : "",
            "block w-full appearance-none placeholder-[#FFFFFF]/50",
            className || ""
          )}
        />
      </div>
    </>
  )
}
