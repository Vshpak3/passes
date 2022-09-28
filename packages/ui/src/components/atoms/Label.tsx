import classNames from "classnames"
import React from "react"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions
} from "../types/FormTypes"

type LabelProps = {
  label?: FormLabel
  name: FormName
  options?: FormOptions
  errors?: FormErrors
  className?: string
}

const Label = ({
  name,
  label,
  errors = {},
  options = {},
  className
}: LabelProps) => {
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

export default Label
