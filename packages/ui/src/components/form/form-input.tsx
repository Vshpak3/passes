import PropTypes from "prop-types"
import React from "react"

import Checkbox from "./checkbox"
import { DragDropFile } from "./drag-drop-file"
import { File } from "./file"
import { Input } from "./input"
import { Select } from "./select"
import { TextArea } from "./text-area"
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
} from "./types"

type FormInputProps = {
  label?: FormLabel
  name: FormName
  type: FormType
  placeholder?: FormPlaceholder
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  selectOptions?: FormSelectOptions
  trigger?: JSX.Element
  multiple?: boolean
  accept?: FileAccept
  className?: string
  rows?: number
  cols?: number
}
export const FormInput = ({
  label,
  name,
  type,
  placeholder,
  options,
  register,
  errors,
  selectOptions,
  multiple,
  accept,
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
        errors={errors}
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
        errors={errors}
        register={register}
        {...rest}
      />
    ),
    toggle: (
      <Checkbox
        name={name}
        type={type}
        label={label}
        options={options}
        errors={errors}
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
          options={options}
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
