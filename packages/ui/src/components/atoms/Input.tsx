import { toLower } from "lodash"
import React from "react"
import ReactInputMask from "react-input-mask"
import { classNames } from "src/helpers"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister,
  FormType
} from "../FormTypes"
import Label from "./Label"

export enum EIcon {
  Left = "LEFT",
  Right = "RIGHT"
}

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
  iconAlign?: EIcon
  textPosition?: string
  mask?: string
}

const Input = ({
  name,
  type,
  label,
  placeholder = "",
  register,
  errors = {},
  options = {},
  className = "",
  icon,
  iconAlign,
  textPosition,
  mask,
  ...rest
}: InputProps) => {
  return (
    <>
      {label && (
        <Label name={name} label={label} errors={errors} options={options} />
      )}

      <div className="w-full">
        {!!icon && (
          <div className="relative text-gray-600">
            <span
              className={`absolute inset-y-0 ${toLower(
                iconAlign
              )}-0 flex pl-2 pt-3 sm:px-4 sm:pr-3`}
            >
              {icon}
            </span>
          </div>
        )}
        {mask ? (
          <ReactInputMask
            mask={mask}
            maskChar=""
            readOnly={options.readOnly}
            autoComplete="off"
            type={type}
            placeholder={placeholder || label}
            {...register(name, options)}
            {...rest}
            className={classNames(
              `block w-full appearance-none rounded-md border p-2 ${
                textPosition === "RIGHT" ? "text-right" : "text-left"
              } min-h-[50px] py-3 px-4 text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
                icon && iconAlign === EIcon.Left ? "pl-[50px]" : "pl-2"
              }`,
              className,
              errors[name] !== undefined ? "border-red-500" : "border-gray-300"
            )}
          >
            {(inputProps: any) => <input {...inputProps} />}
          </ReactInputMask>
        ) : (
          <input
            readOnly={options.readOnly}
            autoComplete="off"
            type={type}
            placeholder={placeholder || label}
            {...register(name, options)}
            {...rest}
            className={classNames(
              `block w-full appearance-none rounded-md border p-2 ${
                textPosition === "RIGHT" ? "text-right" : "text-left"
              } min-h-[50px] py-3 px-4 text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
                icon && iconAlign === EIcon.Left ? "pl-[50px]" : "pl-2"
              }`,
              className,
              errors[name] !== undefined ? "border-red-500" : "border-gray-300"
            )}
          />
        )}
      </div>
    </>
  )
}

export default Input
