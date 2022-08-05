import React from "react"
import { classNames } from "src/helpers"

import { FormErrors, FormLabel, FormName, FormOptions } from "../FormTypes"

type LabelProps = {
  label?: FormLabel
  name: FormName
  options?: FormOptions
  errors?: FormErrors
}

const Label = ({ name, label, errors = {}, options = {} }: LabelProps) => {
  return (
    <label
      htmlFor={name}
      className={classNames(
        "block text-sm font-medium ",
        errors[name] !== undefined ? "text-red-500" : "text-white"
      )}
    >
      {label} {options.required && "*"}
    </label>
  )
}

export default Label
