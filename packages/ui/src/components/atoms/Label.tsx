import classNames from "classnames"
import React from "react"

import { FormErrors, FormLabel, FormName, FormOptions } from "../FormTypes"

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
        "block text-sm font-medium",
        errors[name] ? "text-red-500" : "text-white",
        className ?? ""
      )}
    >
      {label} {options.required && "*"}
    </label>
  )
}

export default Label
