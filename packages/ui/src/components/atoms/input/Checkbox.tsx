import classNames from "classnames"
import React, { FC } from "react"

import {
  FormErrors,
  FormLabel,
  FormName,
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
  errors?: FormErrors
  className?: string
  labelClassName?: string
  checked?: boolean
  disabled?: boolean
  textClassName?: string
}

export const Checkbox: FC<CheckBoxProps> = ({
  name,
  type,
  label,
  register,
  textPosition,
  errors = {},
  className = "",
  labelClassName = "",
  checked,
  disabled,
  textClassName = "",
  ...rest
}) => (
  <div>
    <div
      className={classNames(
        textClassName ? "items-center" : "items-start",
        textPosition === "Special" ? "justify-between" : "",
        "relative flex"
      )}
    >
      {!!textPosition && (
        <div className="mr-3 text-sm">
          {!!label && (
            <Label
              className={labelClassName}
              errors={errors}
              label={label}
              name={`${name}-${type}`}
            />
          )}
        </div>
      )}
      <label
        className={classNames(
          type === "toggle" ? "switch" : "",
          "relative flex h-5 items-center"
        )}
      >
        <input
          checked={checked}
          disabled={disabled}
          id={`${name}-${type}`}
          name={name}
          type="checkbox"
          {...(register && register(name))}
          {...rest}
          className={classNames(
            disabled ? "opacity-50" : "opacity-100",
            errors[name] ? "border-red-500" : "border-gray-300",
            type === "toggle" ? "h-3 w-7" : "",
            "rounded border placeholder-gray-400 shadow-sm ring-passes-primary-color focus:border-passes-primary-color focus:border-transparent focus:text-passes-primary-color focus:ring-passes-primary-color sm:text-sm",
            className
          )}
        />
        {type === "toggle" && (
          <div
            className={classNames(
              className,
              "slider absolute -left-1 h-5 w-9 cursor-pointer rounded-2xl bg-[#ccc] before:absolute before:left-1 before:bottom-[2px] before:h-4 before:w-4 before:rounded-[50%]"
            )}
          />
        )}
      </label>
      {!textPosition && (
        <div className={classNames(textClassName, "ml-3 text-sm")}>
          {!!label && (
            <Label
              className={labelClassName}
              errors={errors}
              label={label}
              name={`${name}-${type}`}
            />
          )}
        </div>
      )}
    </div>
  </div>
)
