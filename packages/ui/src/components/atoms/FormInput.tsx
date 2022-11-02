import React, { CSSProperties, FC } from "react"

import { Checkbox } from "src/components/atoms/Checkbox"
import { EIcon, Input } from "src/components/atoms/Input"
import { Select, SelectProps } from "src/components/atoms/Select"
import { TagsInput } from "src/components/molecules/TagsInput"
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
  selectOptions,
  className,
  labelClassName,
  icon,
  iconAlign,
  tagsFromServer,
  checked,
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
    ),
    radio: (
      <Checkbox
        name={name}
        type={type}
        label={label}
        checked={checked}
        options={options}
        className={className}
        textPosition={textPosition}
        errors={errors}
        register={register}
        labelClassName={labelClassName}
        {...rest}
      />
    ),
    tags: (
      <TagsInput
        name={name}
        // type={type}
        placeholder={placeholder}
        label={label}
        register={register}
        options={options}
        tagsFromServer={tagsFromServer}
        // errors={errors}
        // icon={icon}
        {...rest}
      />
    ),
    checkbox: (
      <Checkbox
        name={name}
        type={type}
        label={label}
        options={options}
        className={className}
        textPosition={textPosition}
        errors={errors}
        register={register}
        labelClassName={labelClassName}
        {...rest}
      />
    ),
    toggle: (
      <Checkbox
        textPosition={textPosition}
        name={name}
        type={type}
        label={label}
        options={options}
        errors={errors}
        className={className}
        register={register}
        {...rest}
      />
    ),
    select: (
      <Select
        name={name}
        label={label}
        placeholder={placeholder}
        register={register}
        options={options}
        selectOptions={selectOptions}
        errors={errors}
        className={className}
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
