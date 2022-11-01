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
  rules: RegisterOptions
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
        rules={rules}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div className="relative mt-4">
            <span className="absolute right-3 top-4 flex flex-row">
              <VisaIcon />
              <DiscoverCardIcon />
              <MasterCardIcon />
            </span>
            <input
              className="block min-h-[50px] w-full appearance-none rounded-md border border-passes-dark-100 bg-transparent p-3 text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              onChange={(event) => handleChange(event, onChange)}
              maxLength={19}
              placeholder="Card number"
              value={visibleValue}
            />
            {error && (
              <span className="mt-2 text-xs text-red-500">{error.message}</span>
            )}
          </div>
        )}
      />
    </div>
  )
}
