import { Message, ValidationRule } from "react-hook-form"

export type FormLabel = string
export type FormName = string
export type FormType =
  | "text"
  | "email"
  | "phone"
  | "number"
  | "password"
  | "date"
  | "text-area"
  | "checkbox"
  | "toggle"
  | "select"
  | "file"
  | "drag-drop-file"
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
export type FormControl = any
export type FormErrors = any
export type FormSelectOptions = Array<string | { value: string; label: string }>
export type FileAccept = Array<"audio" | "image" | "video" | `.${string}`>
