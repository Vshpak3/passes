import PropTypes from "prop-types"
import React from "react"
import { Checkbox, File, Input, Select, TextArea } from "src/components/atoms"
import { EIcon } from "src/components/atoms/Input"
import { DragDropFile, TagsInput } from "src/components/molecules"
import {
  FileAccept,
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder,
  FormRegister,
  FormSelectOptions,
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
  selectOptions?: FormSelectOptions
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
  value?: string
  mask?: string
  checked?: boolean
  iconMargin?: string
}

const FormInput = ({
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
  multiple,
  accept,
  icon,
  iconAlign,
  tagsFromServer,
  checked,
  iconMargin,
  ...rest
}: FormInputProps) => {
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
    password: (
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
    "text-area": (
      <TextArea
        name={name}
        label={label}
        options={options}
        errors={errors}
        register={register}
        className={className}
        placeholder={placeholder}
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
        selectOptions={selectOptions as FormSelectOptions}
        errors={errors}
        className={className}
        {...rest}
      />
    ),
    file: (
      <File
        name={name}
        label={label}
        accept={accept}
        placeholder={placeholder}
        register={register}
        options={options}
        errors={errors}
        {...rest}
      />
    ),
    "drag-drop-file": (
      <DragDropFile
        name={name}
        register={register}
        options={options}
        errors={errors}
        multiple={multiple}
        accept={accept}
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

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  register: PropTypes.func.isRequired,
  control: PropTypes.any,
  useFieldsArray: PropTypes.any,
  error: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.any
}

export default FormInput
