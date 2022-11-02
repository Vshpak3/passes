import classNames from "classnames"
import React, { FC } from "react"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions
} from "src/components/atoms/input/InputTypes"
import { formatText } from "src/helpers/formatters"

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
      className={classNames(
        "block ",
        errors[name] ? "text-red-500" : "text-white",
        className ?? "text-sm font-medium"
      )}
      htmlFor={name}
    >
      {formatText(label)} {options.required && "*"}
    </label>
  )
}
