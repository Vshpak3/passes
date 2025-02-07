import classNames from "classnames"
import DiscoverCardIcon from "public/icons/discover-icon.svg"
import MasterCardIcon from "public/icons/mastercard-icon.svg"
import VisaIcon from "public/icons/visa-icon.svg"
import React, { ChangeEvent, FC, useState } from "react"
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions
} from "react-hook-form"

interface CreditCardInputProps {
  name: string
  control: Control<FieldValues>
  rules?: RegisterOptions
}

export const CreditCardInput: FC<CreditCardInputProps> = ({
  control,
  name,
  rules
}) => {
  const [visibleValue, setVisibleValue] = useState("")

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (v: string) => void
  ) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
    setVisibleValue(value)
    onChange(value)
  }

  return (
    <div className="flex flex-col">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div className="relative mt-4">
            <span className="absolute right-3 top-4 flex flex-row">
              <VisaIcon />
              <DiscoverCardIcon />
              <MasterCardIcon />
            </span>
            <input
              autoComplete="cc-number"
              className={classNames(
                "border border-passes-dark-100 focus:border-passes-pink-100/80 focus:outline-none focus:ring-passes-pink-100/80",
                "block min-h-[50px] w-full appearance-none rounded-md bg-transparent p-3 text-sm shadow-sm placeholder:text-gray-400 read-only:pointer-events-none read-only:bg-gray-200",
                error && "border-red-500"
              )}
              maxLength={19}
              name={name}
              onChange={(event) => handleChange(event, onChange)}
              placeholder="Card number"
              value={visibleValue}
            />
            {error && (
              <span className="mt-2 text-xs text-red-500">{error.message}</span>
            )}
          </div>
        )}
        rules={rules}
      />
    </div>
  )
}
