import React from "react"
import { classNames } from "src/helpers"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister,
  FormSelectOptions
} from "../FormTypes"
import Label from "./Label"

type SelectProps = {
  label?: FormLabel
  name: FormName
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  placeholder?: FormPlaceholder
  selectOptions: FormSelectOptions
  className?: string
}
const Select = ({
  name,
  label,
  register,
  errors = {},
  options,
  selectOptions,
  placeholder,
  className = "",
  ...rest
}: SelectProps) => {
  return (
    <>
      {label && (
        <Label name={name} label={label} errors={errors} options={options} />
      )}

      <select
        {...register(name, options)}
        className={classNames(
          errors[name] !== undefined ? "border-red-500" : "border-gray-300",
          "block w-full rounded-md p-2 text-base invalid:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:px-4 sm:text-sm",
          className
        )}
        {...rest}
      >
        {placeholder && (
          <option key={placeholder} value="" selected>
            {placeholder}
          </option>
        )}
        {selectOptions.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </>
  )
}

export default Select
