import classNames from "classnames"
import { FC, FormEvent } from "react"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister
} from "src/components/atoms/input/InputTypes"
import { Label } from "src/components/atoms/Label"

type SelectOption = {
  value: string | number
  label: string | JSX.Element
}

type FormSelectOption = string | SelectOption
type FormSelectOptions = Array<FormSelectOption>

type NativeSelectProps = {
  autoComplete: string
  label?: FormLabel
  name: FormName
  options?: FormOptions
  register?: FormRegister
  onCustomChange?: (value: string) => void
  errors?: FormErrors
  defaultValue?: FormSelectOption
  placeholder?: FormPlaceholder
  selectOptions: FormSelectOptions
  className?: string
  transparent?: boolean
  hasError?: boolean
}

export const NativeSelect: FC<NativeSelectProps> = ({
  autoComplete,
  name,
  label,
  register,
  errors = {},
  options,
  selectOptions,
  placeholder = "",
  className = "",
  onCustomChange,
  transparent = true,
  hasError = false
}) => {
  const control = onCustomChange
    ? {
        onChange: (event: FormEvent<HTMLSelectElement>) =>
          onCustomChange(event.currentTarget.value)
      }
    : register(name, options)

  return (
    <div className="relative">
      {!!label && (
        <Label errors={errors} label={label} name={name} options={options} />
      )}
      <select
        autoComplete={autoComplete}
        className={classNames(
          className,
          errors?.[name] ? "border-red-500" : "border-passes-dark-100",
          hasError && "border-red-500",
          transparent ? "bg-transparent" : "bg-black",
          "my-1 flex min-h-[50px] w-full appearance-none items-center justify-between rounded-md border px-4 py-3 text-left text-sm invalid:text-gray-400 focus:border-passes-pink-100/80 focus:ring-passes-pink-100/80"
        )}
        name={name}
        {...control}
        defaultValue={placeholder}
      >
        {[placeholder, ...selectOptions]?.map((option, index) => (
          <option
            className="block cursor-pointer p-2 py-1 px-4 text-passes-primary-color invalid:text-gray-400 disabled:text-gray-400"
            disabled={index === 0 || !option}
            hidden={index === 0}
            key={
              typeof option === "string"
                ? `${option}-${index}`
                : `${option.value}-${index}`
            }
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
      {Boolean(errors?.[name]) && (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      )}
    </div>
  )
}
