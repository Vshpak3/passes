import React, { CSSProperties, FC } from "react"

import { EIcon, Input } from "src/components/atoms/Input"
import { SelectProps } from "src/components/atoms/Select"
import {
  FileAccept,
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister,
  FormType
} from "src/components/types/FormTypes"

type FormInputProps = {
  name: FormName
  type: FormType
  label?: FormLabel
  placeholder?: FormPlaceholder
  options?: FormOptions
  register?: FormRegister
  errors?: FormErrors
  selectOptions?: SelectProps["selectOptions"]
  defaultValue?: SelectProps["defaultValue"]
  onChange?: SelectProps["onChange"]
  showOnTop?: SelectProps["showOnTop"]
  trigger?: JSX.Element
  multiple?: boolean
  accept?: FileAccept
  className?: string
  labelClassName?: string
  rows?: number
  cols?: number
  icon?: React.ReactNode
  textPosition?: string
  tagsFromServer?: string[]
  iconAlign?: EIcon
  onFocus?: (event: Event) => void
  onBlur?: (event: Event) => void
  value?: string
  mask?: string
  checked?: boolean
  iconMargin?: string
  helperText?: string
  min?: number
  max?: number
  step?: number
  maxLength?: string
  autoComplete?: string
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  style?: CSSProperties
}

export const FormInput: FC<FormInputProps> = ({
  textPosition,
  label,
  name,
  type,
  placeholder,
  options,
  register,
  errors,
  className,
  icon,
  iconAlign,
  iconMargin,
  ...rest
}) => {
  const input: Partial<{ [key in FormType]: JSX.Element }> = {
    text: (
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        label={label}
        register={register}
        options={options}
        className={className}
        errors={errors}
        textPosition={textPosition}
        icon={icon}
        iconAlign={iconAlign}
        iconMargin={iconMargin}
        {...rest}
      />
    ),
    date: (
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        label={label}
        register={register}
        options={options}
        className={className}
        errors={errors}
        textPosition={textPosition}
        icon={icon}
        iconAlign={iconAlign}
        {...rest}
      />
    )
  }
  return (
    <>
      {input[type] || (
        <Input
          register={register}
          name={name}
          type={type}
          label={label}
          textPosition={textPosition}
          placeholder={placeholder}
          options={options}
          className={className}
          errors={errors}
          {...rest}
        />
      )}
    </>
  )
}
