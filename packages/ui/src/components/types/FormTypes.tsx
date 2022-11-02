// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Message, ValidationRule } from "react-hook-form"

export type FormLabel = string
export type FormName = string
export type FormType =
  | "text"
  | "email"
  | "tel"
  | "phone"
  | "password"
  | "date"
  | "select"
  | "tags"
export type FormPlaceholder = string
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
export type FormRegister = any
export type FormErrors = any
export type SelectOption = {
  value: string | number
  label: string | JSX.Element
}
export type FormSelectOption = string | SelectOption
export type FormSelectOptions = Array<FormSelectOption>
export type FileAccept = Array<"audio" | "image" | "video" | `.${string}`>
