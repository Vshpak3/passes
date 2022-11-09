import classNames from "classnames"
import React, { FC } from "react"

import {
  FormErrors,
  FormName,
  FormPlaceholder,
  FormRegister
} from "src/components/atoms/input/InputTypes"
import { preventNegative } from "src/helpers/keyboard"

type NumberFormType = "integer" | "currency"

// No min/max; should be handled by yup
type NumberInputProps = {
  register: FormRegister
  name: FormName
  type: NumberFormType
  placeholder?: FormPlaceholder
  maxInput?: number
  allowNegative?: boolean
  errors?: FormErrors
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
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
  onChange
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

    if (!allowNegative) {
      preventNegative(e)
    }
  }

  const _placeholder = placeholder || (type === "currency" ? "0.00" : "0")

  return (
    <div>
      <input
        {...register(name)}
        autoComplete="off"
        className={classNames(
          "block w-full appearance-none rounded-md border border-passes-dark-100 bg-transparent py-3 px-4 text-left text-sm placeholder-gray-400 shadow-sm focus:border-passes-dark-200 focus:ring-0",
          className,
          errors[name] !== undefined ? "!border-red-500" : "border-gray-300"
        )}
        onKeyPress={onKeyPress}
        placeholder={_placeholder}
        step={type === "currency" ? "0.01" : "1"}
        type="number"
        onChange={onChange}
      />
      {errors && errors[name] && (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      )}
    </div>
  )
}
