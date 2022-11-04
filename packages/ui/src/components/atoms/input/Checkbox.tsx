import classNames from "classnames"
import React, { FC } from "react"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormRegister
} from "src/components/atoms/input/InputTypes"
import { Label } from "src/components/atoms/Label"

type CheckBoxTypes = "radio" | "checkbox" | "toggle"

type CheckBoxProps = {
  name: FormName
  type: CheckBoxTypes
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  register?: FormRegister
  textPosition?: string
  label?: FormLabel
  options?: FormOptions
  errors?: FormErrors
  className?: string
  labelClassName?: string
  checked?: boolean
}

export const Checkbox: FC<CheckBoxProps> = ({
  name,
  type,
  label,
  register,
  textPosition,
  options = {},
  errors = {},
  className = "",
  labelClassName = "",
  checked,
  ...rest
}) => (
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
              errors={errors}
              label={label}
              name={`${name}-${type}`}
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
          checked={checked}
          id={`${name}-${type}`}
          name={name}
          type="checkbox"
          {...(register && register(name, options))}
          {...rest}
          className={classNames(
            errors[name] ? "border-red-500" : "border-gray-300",
            type === "toggle" ? "w-9" : "",
            className
          )}
        />
        {type === "toggle" && <div className={classNames(className)} />}
      </label>
      {!textPosition && (
        <div className="ml-3 text-sm">
          {label && (
            <Label
              className={labelClassName}
              errors={errors}
              label={label}
              name={`${name}-${type}`}
              options={options}
            />
          )}
        </div>
      )}
    </div>
  </div>
)
