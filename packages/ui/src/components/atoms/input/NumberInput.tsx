import classNames from "classnames"
import React, { FC, useState } from "react"
import { toast } from "react-toastify"

import {
  FormAutoComplete,
  FormErrors,
  FormName,
  FormPlaceholder,
  FormRegister
} from "src/components/atoms/input/InputTypes"
import { isCurrency } from "src/helpers/formatters"
import { preventNegative } from "src/helpers/keyboard"

type NumberFormType = "integer" | "currency" | "float"

// No min/max; should be handled by yup
type NumberInputProps = {
  register: FormRegister
  name: FormName
  type: NumberFormType
  autoComplete?: FormAutoComplete | "off"
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
  autoComplete,
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
  const _placeholder =
    placeholder === undefined
      ? type === "currency"
        ? "0.00"
        : type === "float"
        ? "0.0"
        : "0"
      : placeholder

  return (
    <div>
      <input
        {...register(name)}
        autoComplete={autoComplete}
        className={classNames(
          "focus:border-passes-pink-100/80 focus:outline-none focus:ring-passes-pink-100/80",
          "block w-full appearance-none rounded-md border bg-transparent py-3 px-4 text-left text-sm placeholder-gray-400 shadow-sm",
          className,
          errors[name] !== undefined && "border-red-500"
        )}
        onInput={validate}
        onKeyPress={onKeyPress}
        placeholder={_placeholder}
        step={
          type === "currency" ? ".01" : type === "integer" ? "1" : "0.00001"
        }
        type="number"
      />
      {errors && !!errors[name] && (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      )}
    </div>
  )
}
