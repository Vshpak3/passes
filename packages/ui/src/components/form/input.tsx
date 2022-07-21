import React from "react"
import { classNames } from "src/helpers/classNames"

import { Label } from "./label"
import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister,
  FormType
} from "./types"

type InputProps = {
  label?: FormLabel
  name: FormName
  type: FormType
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  placeholder?: FormPlaceholder
}

export const Input = ({
  name,
  type,
  label,
  placeholder,
  register,
  errors = {},
  options = {},
  ...rest
}: InputProps) => {
  return (
    <>
      {label && (
        <Label name={name} label={label} errors={errors} options={options} />
      )}
      <div className="mt-1">
        <input
          readOnly={options.readOnly}
          autoComplete="off"
          type={type}
          placeholder={placeholder || label}
          {...register(name, options)}
          {...rest}
          className={classNames(
            errors[name] !== undefined ? "border-red-500" : "border-gray-300",
            "block w-full appearance-none rounded-md border p-2 placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:px-4 sm:py-3 sm:text-sm"
          )}
        />
      </div>
    </>
  )
}
