import classNames from "classnames"
import React, { FC, useState } from "react"
import { toast } from "react-toastify"

import {
  FormErrors,
  FormName,
  FormPlaceholder,
  FormRegister
} from "src/components/atoms/input/InputTypes"
import { isCurrency } from "src/helpers/formatters"
import { preventNegative } from "src/helpers/keyboard"

type NumberFormType = "integer" | "currency"

// No min/max; should be handled by yup
type NumberInputProps = {
  register: FormRegister
  name: FormName
  type: NumberFormType
  placeholder?: FormPlaceholder
  maxInput?: number
  maxInputMessage?: string
  allowNegative?: boolean
  errors?: FormErrors
  className?: string
}

// can't use onChange - messes with useForm register/watch
export const NumberInput: FC<NumberInputProps> = ({
  register,
  name,
  type,
  placeholder,
  maxInput = 100000,
  allowNegative = false,
  errors = {},
  maxInputMessage,
  className = ""
}) => {
  const [prevValue, setPrevValue] = useState<string>("0")
  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!allowNegative) {
      preventNegative(e)
    }
    if (e.key.match(/[a-zA-Z]/)) {
      e.preventDefault()
    }
  }

  const validate = function (e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (type === "currency" && value.length > 0 && !isCurrency(value)) {
      e.target.value = prevValue
    } else if (maxInput !== undefined && parseFloat(value) > maxInput) {
      if (maxInputMessage) {
        toast.error(maxInputMessage)
      }
      e.target.value = prevValue
    }

    setPrevValue(e.target.value)
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
          errors[name] !== undefined && "border-red-500"
        )}
        onInput={validate}
        onKeyPress={onKeyPress}
        placeholder={_placeholder}
        step={type === "currency" ? ".01" : "1"}
        type="number"
      />
      {errors && !!errors[name] && (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      )}
    </div>
  )
}
