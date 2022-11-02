import classNames from "classnames"
import { toLower } from "lodash"
import React, { FC } from "react"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister
} from "src/components/atoms/input/InputTypes"
import { Label } from "src/components/atoms/Label"

type FormType =
  | "text"
  | "email"
  | "tel"
  | "phone"
  | "date"
  | "tags"
  | "password"

export enum EIcon {
  Left = "LEFT",
  Right = "RIGHT"
}

export type InputProps = {
  name: FormName
  type: FormType
  register: FormRegister
  label?: FormLabel
  options?: FormOptions
  errors?: FormErrors
  placeholder?: FormPlaceholder
  className?: string
  icon?: React.ReactNode
  iconMargin?: string
  iconAlign?: EIcon
  textPosition?: string
  value?: string
  onFocus?: (event: Event) => void
}

export const Input: FC<InputProps> = ({
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
  iconMargin = "0",
  ...rest
}) => {
  return (
    <>
      {label && (
        <Label errors={errors} label={label} name={name} options={options} />
      )}

      <div className="w-full">
        {!!icon && (
          <div className="relative text-gray-600">
            <span
              className={`absolute inset-y-0 ${toLower(
                iconAlign
              )}-0 left-[${iconMargin}px] flex pl-2 pt-3 sm:px-4 sm:pr-3`}
            >
              {icon}
            </span>
          </div>
        )}
        <input
          autoComplete="off"
          placeholder={placeholder || label}
          readOnly={options.readOnly}
          type={type}
          {...register(name, options)}
          {...rest}
          className={classNames(
            `block w-full appearance-none rounded-md border border-passes-dark-100 bg-transparent p-3 ${
              textPosition === "RIGHT" ? "text-right" : "text-left"
            } min-h-[50px] py-3 px-4 text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
              icon && iconAlign === EIcon.Left ? "pl-[50px]" : "pl-3"
            }`,
            className,
            errors[name] !== undefined ? "!border-red-500" : "border-gray-300"
          )}
        />
        {errors && errors[name] && (
          <span className="text-xs text-red-500">{errors[name].message}</span>
        )}
      </div>
    </>
  )
}
