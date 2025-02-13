import classNames from "classnames"
import { toLower } from "lodash"
import React, { FC } from "react"

import {
  FormAutoComplete,
  FormErrors,
  FormLabel,
  FormName,
  FormPlaceholder,
  FormRegister
} from "src/components/atoms/input/InputTypes"
import { Label } from "src/components/atoms/Label"

type FormType =
  | "text"
  | "email"
  | "tel"
  | "phone"
  | "date"
  | "tags"
  | "password"

export enum EIcon {
  Left = "LEFT",
  Right = "RIGHT"
}

export type InputProps = {
  name: FormName
  type: FormType
  autoComplete?: FormAutoComplete | "off"
  register: FormRegister
  label?: FormLabel
  errors?: FormErrors
  placeholder?: FormPlaceholder
  className?: string
  icon?: React.ReactNode
  iconMargin?: string
  iconAlign?: EIcon
  textPosition?: string
  value?: string
  disableInputCorrects?: boolean
  onFocus?: (event: Event) => void
  transparent?: boolean
  outlineColor?: string
  outerClassName?: string
}

export const Input: FC<InputProps> = ({
  name,
  type,
  autoComplete = "off",
  label,
  placeholder = "",
  register,
  errors = {},
  className = "",
  icon,
  iconAlign,
  textPosition,
  disableInputCorrects = false,
  iconMargin = "0",
  transparent = true,
  outlineColor = "pink",
  outerClassName = "w-full",
  ...rest
}) => (
  <>
    {!!label && <Label errors={errors} label={label} name={name} />}
    <div className={outerClassName}>
      {!!icon && (
        <div className="relative text-white">
          <span
            className={classNames(
              "absolute inset-y-0 flex pl-2 pt-3 sm:px-4 sm:pr-3",
              `${toLower(iconAlign)}-0 left-[${iconMargin}px]`
            )}
          >
            {icon}
          </span>
        </div>
      )}
      <input
        autoComplete={autoComplete}
        placeholder={placeholder || label}
        type={type}
        {...register(name)}
        {...(disableInputCorrects
          ? {
              autoCorrect: "off",
              autoCapitalize: "off",
              spellCheck: "false"
            }
          : {})}
        {...rest}
        className={classNames(
          outlineColor === "pink"
            ? "focus:border-passes-pink-100/80 focus:outline-none focus:ring-passes-pink-100/80"
            : outlineColor === "purple"
            ? "focus:border-passes-secondary-color/80 focus:outline-none focus:ring-passes-secondary-color/80"
            : "",
          transparent ? "bg-transparent" : "bg-black",
          textPosition === "RIGHT" ? "text-right" : "text-left",
          "block w-full appearance-none rounded-md border border-passes-dark-100 p-3",
          "min-h-[50px] py-3 px-4 text-sm placeholder-gray-400 shadow-sm read-only:pointer-events-none read-only:bg-gray-200",
          icon && iconAlign === EIcon.Left ? "pl-[50px]" : "pl-3",
          className,
          errors[name] !== undefined && "border-red-500"
        )}
      />
      {errors && !!errors[name] && (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      )}
    </div>
  </>
)
