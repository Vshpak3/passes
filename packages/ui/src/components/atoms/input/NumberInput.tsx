import classNames from "classnames"
import React, { FC } from "react"

import {
  FormErrors,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister
} from "src/components/atoms/input/InputTypes"

type NumberFormType = "integer" | "currency"

// No min/max; should be handled by yup
type NumberInputProps = {
  register: FormRegister
  name: FormName
  type: NumberFormType
  placeholder?: FormPlaceholder
  maxInput?: number
  allowNegative?: boolean
  options?: FormOptions // TODO: remove and move to yup
  errors?: FormErrors
  className?: string
}

export const NumberInput: FC<NumberInputProps> = ({
  register,
  name,
  type,
  placeholder,
  maxInput,
  allowNegative = false,
  errors = {},
  className = "",
  options = {}
}) => {
  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value = e.target.value

    if (
      maxInput &&
      value.length >=
        maxInput?.toString().length + (type === "currency" ? 3 : 0)
    ) {
      e.preventDefault()
    }

    if (!allowNegative && e.code === "Minus") {
      e.preventDefault()
    }
  }

  const _placeholder = placeholder || (type === "currency" ? "0.00" : "0")

  return (
    <div className="w-full">
      <input
        {...register(name, options)}
        placeholder={_placeholder}
        autoComplete="off"
        type="number"
        onKeyPress={onKeyPress}
        className={classNames(
          "block min-h-[50px] w-full appearance-none rounded-md border border-passes-dark-100 bg-transparent p-3 py-3 px-4 text-left text-sm placeholder-gray-400 shadow-sm focus:border-passes-dark-200 focus:ring-0",
          className,
          errors[name] !== undefined ? "!border-red-500" : "border-gray-300"
        )}
      />
      {errors && errors[name] && (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      )}
    </div>
  )
}
