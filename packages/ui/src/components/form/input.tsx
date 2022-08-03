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
  className?: string
  icon?: React.ReactNode
}

export const Input = ({
  name,
  type,
  label,
  placeholder,
  register,
  errors = {},
  options = {},
  className = "",
  icon,
  ...rest
}: InputProps) => {
  return (
    <>
      {label && (
        <Label name={name} label={label} errors={errors} options={options} />
      )}
      {!!icon && (
        <div className="relative text-gray-600">
          <span className="absolute inset-y-0 left-0 flex pl-2 pt-3 sm:px-4 sm:pr-3">
            {icon}
          </span>
        </div>
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
            `block w-full appearance-none rounded-md border p-2 placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:px-4 sm:py-3  sm:text-sm ${
              icon ? "sm:pl-[50px]" : ""
            }`,
            className
          )}
        />
      </div>
    </>
  )
}
