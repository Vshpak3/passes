import classNames from "classnames"
import React, { FC } from "react"
import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions
} from "src/components/types/FormTypes"

type LabelProps = {
  label?: FormLabel
  name: FormName
  options?: FormOptions
  errors?: FormErrors
  className?: string
}

export const Label: FC<LabelProps> = ({
  name,
  label,
  errors = {},
  options = {},
  className
}) => {
  return (
    <label
      htmlFor={name}
      className={classNames(
        "block ",
        errors[name] ? "text-red-500" : "text-white",
        className ?? "text-sm font-medium"
      )}
    >
      {label} {options.required && "*"}
    </label>
  )
}
