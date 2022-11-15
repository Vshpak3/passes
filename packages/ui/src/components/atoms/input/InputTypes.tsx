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

// Chrome/Safari/etc. are often smart and can guess autofills depending on the
// name/other props, but that is not 100%. Using these is the most robust way
// to ensure autofill works correctly.
// DO NOT CHANGE. This list is taken directly from
// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
export type FormAutoComplete =
  | "name"
  | "honorific-prefix"
  | "given-name"
  | "additional-name"
  | "family-name"
  | "honorific-suffix"
  | "nickname"
  | "organization-title"
  | "username"
  | "new-password"
  | "current-password"
  | "one-time-code"
  | "organization"
  | "street-address"
  | "address-line1"
  | "address-line2"
  | "address-line3"
  | "address-level4"
  | "address-level3"
  | "address-level2"
  | "address-level1"
  | "country" // ISO 3166-1-alpha-2 country code
  | "country-name"
  | "postal-code"
  | "cc-name"
  | "cc-given-name"
  | "cc-additional-name"
  | "cc-family-name"
  | "cc-number"
  | "cc-exp"
  | "cc-exp-month"
  | "cc-exp-year"
  | "cc-csc"
  | "cc-type"
  | "transaction-currency"
  | "transaction-amount"
  | "language"
  | "bday"
  | "bday-day"
  | "bday-month"
  | "bday-year"
  | "sex"
  | "url"
  | "photo"
  | "tel"
  | "tel-country-code"
  | "tel-national"
  | "tel-area-code"
  | "tel-local"
  | "tel-local-prefix"
  | "tel-local-suffix"
  | "tel-extension"
  | "email"
  | "impp"
  | "webauthn"
