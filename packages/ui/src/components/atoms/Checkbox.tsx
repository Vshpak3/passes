import React from "react"
import { classNames } from "src/helpers"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormRegister,
  FormType
} from "../FormTypes"
import Label from "./Label"

type CheckBoxProps = {
  textPosition?: string
  label?: FormLabel
  name: FormName
  type: FormType
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  className?: string
}

const Checkbox = ({
  name,
  type,
  label,
  register,
  errors = {},
  options = {},
  className = "",
  textPosition,
  ...rest
}: CheckBoxProps) => {
  return (
    <div>
      <div className="relative flex items-start">
        {!!textPosition && (
          <div className="mr-3 text-sm">
            {label && (
              <Label
                name={`${name}-${type}`}
                label={label}
                errors={errors}
                options={options}
              />
            )}
          </div>
        )}
        <label
          className={classNames(
            type === "toggle" ? "switch" : "",
            "flex h-5 items-center"
          )}
        >
          <input
            id={`${name}-${type}`}
            name={name}
            type="checkbox"
            {...register(name, options)}
            {...rest}
            className={classNames(
              errors[name] !== undefined ? "border-red-500" : "border-gray-300",
              type === "toggle" ? "w-9" : "",
              "rounded border placeholder-gray-400 shadow-sm ring-[#BF7AF0] focus:border-[#BF7AF0] focus:bg-[#BF7AF0] focus:text-[#BF7AF0] focus:outline-none focus:ring-[#BF7AF0] sm:text-sm",
              className
            )}
          />
          {type === "toggle" && (
            <div
              className={classNames(
                className,
                "slider absolute inset-0 h-5 w-9 cursor-pointer rounded-2xl bg-[#ccc] before:absolute before:left-1 before:bottom-[2px] before:h-4 before:w-4 before:rounded-[50%]"
              )}
            />
          )}
        </label>
        {!textPosition && (
          <div className="ml-3 text-sm">
            {label && (
              <Label
                name={`${name}-${type}`}
                label={label}
                errors={errors}
                options={options}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkbox
