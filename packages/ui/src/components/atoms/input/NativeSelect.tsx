import classNames from "classnames"
import { FC } from "react"

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
  register: FormRegister
  errors?: FormErrors
  defaultValue?: FormSelectOption
  placeholder?: FormPlaceholder
  selectOptions?: FormSelectOptions
  className?: string
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
  className = ""
}) => {
  return (
    <div className="relative">
      {!!label && (
        <Label errors={errors} label={label} name={name} options={options} />
      )}
      <select
        autoComplete={autoComplete}
        className={classNames(
          "my-1 flex min-h-[50px] w-full appearance-none items-center justify-between rounded-md border bg-passes-black px-4 py-3 text-left text-sm invalid:text-gray-400 focus:border-passes-pink-100/80 focus:ring-passes-pink-100/80",
          className,
          errors?.[name] ? "border-red-500" : "border-passes-dark-100"
        )}
        name={name}
        placeholder={placeholder}
        {...register(name)}
      >
        <option disabled selected value="">
          {" "}
        </option>
        {selectOptions?.map((option) => (
          <option
            className="block cursor-pointer p-2 py-1 px-4"
            key={typeof option === "string" ? option : option.value}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
      {!!errors?.[name] && (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      )}
    </div>
  )
}
