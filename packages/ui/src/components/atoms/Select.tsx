import classNames from "classnames"
import React from "react"

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
  onChange?: (e: Event) => void
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
  onChange,
  ...rest
}: SelectProps) => {
  const customChange = () => (onChange ? { onChange } : {})
  return (
    <>
      {label && (
        <Label name={name} label={label} errors={errors} options={options} />
      )}

      <select
        {...register(name, options)}
        {...customChange()}
        className={classNames(
          errors[name] !== undefined ? "border-red-500" : "border-gray-300",
          "block min-h-[50px] w-full appearance-none rounded-md border p-2 px-4 py-3 text-base text-sm invalid:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-blue-500",
          className
        )}
        {...rest}
      >
        {placeholder && (
          <option key={placeholder} value="" selected>
            {placeholder}
          </option>
        )}
        {selectOptions.map((option) => {
          const key = typeof option === "string" ? option : option.value
          const value = typeof option === "string" ? option : option.value
          const label = typeof option === "string" ? option : option.label
          return (
            <option key={key} value={value}>
              {label}
            </option>
          )
        })}
      </select>
    </>
  )
}

export default Select
