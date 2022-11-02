import { Message, ValidationRule } from "react-hook-form"

export type FormLabel = string
export type FormName = string
export type FormPlaceholder = string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormRegister = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormErrors = any

// TOOD: remove and switch to yup for all of these uses
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormOptions = Partial<{
  required: Message | ValidationRule<boolean>
  min: ValidationRule<number | string>
  max: ValidationRule<number | string>
  maxLength: ValidationRule<number | string>
  minLength: ValidationRule<number | string>
  pattern: ValidationRule<RegExp>
  readOnly: ValidationRule<boolean>
  validate: any
  onChange?: (event: any, keyDownEvent?: any) => void
  onBlur?: (event: any) => void
}>
