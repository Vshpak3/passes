import classNames from "classnames"
import React from "react"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormRegister,
  FormType
} from "../types/FormTypes"
import Label from "./Label"

type CheckBoxProps = {
  name: FormName
  type: FormType
  register: FormRegister
  textPosition?: string
  label?: FormLabel
  options?: FormOptions
  errors?: FormErrors
  className?: string
  labelClassName?: string
}

const Checkbox = ({
  name,
  type,
  label,
  register,
  textPosition,
  options = {},
  errors = {},
  className = "",
  labelClassName = "",
  ...rest
}: CheckBoxProps) => (
  <div>
    <div
      className={classNames(
        textPosition === "Special" ? "justify-between" : "",
        "relative flex items-start"
      )}
    >
      {!!textPosition && (
        <div className="mr-3 text-sm">
          {label && (
            <Label
              className={labelClassName}
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
            errors[name] ? "border-red-500" : "border-gray-300",
            type === "toggle" ? "w-9" : "",
            "rounded border placeholder-gray-400 shadow-sm ring-passes-secondary-color focus:border-passes-secondary-color focus:bg-passes-secondary-color focus:text-passes-secondary-color focus:outline-none focus:ring-passes-secondary-color sm:text-sm",
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
              className={labelClassName}
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

export default Checkbox
