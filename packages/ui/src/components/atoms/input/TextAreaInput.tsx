import classNames from "classnames"
import React, { FC, useEffect, useRef, useState } from "react"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormRegister
} from "src/components/atoms/input/InputTypes"
import { Label } from "src/components/atoms/Label"

type TextAreaInputProps = {
  label?: FormLabel
  name: FormName
  options?: FormOptions
  register: FormRegister
  errors?: FormErrors
  rows?: number
  cols?: number
  className?: string
  placeholder?: string
}

export const TextAreaInput: FC<TextAreaInputProps> = ({
  name,
  label,
  register,
  errors = {},
  options = {},
  className,
  rows = 2,
  cols,
  placeholder,
  ...rest
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [keyDownEvent, setKeyDownEvent] = useState<unknown>(null)
  const { ref, ...reg } = register(name, {
    ...options,
    onChange: (event: unknown) => {
      if (options.onChange) {
        options.onChange(event, keyDownEvent)
      }
    }
  })
  useEffect(() => {
    if (textAreaRef.current) {
      const keyDownEvent = function (event: unknown) {
        setKeyDownEvent(event)
      }

      const keyUpEvent = function () {
        setKeyDownEvent(null)
      }

      textAreaRef.current.addEventListener("keydown", keyDownEvent)
      textAreaRef.current.addEventListener("keyup", keyUpEvent)
      return () => {
        textAreaRef.current?.removeEventListener("keydown", keyDownEvent)
        textAreaRef.current?.removeEventListener("keyup", keyUpEvent)
      }
    }
  }, [textAreaRef])

  return (
    <>
      {!!label && (
        <Label errors={errors} label={label} name={name} options={options} />
      )}
      <textarea
        cols={cols}
        id={name}
        name={name}
        placeholder={placeholder}
        ref={(r) => {
          ref(r)
          textAreaRef.current = r
        }}
        rows={rows}
        {...reg}
        {...rest}
        className={classNames(
          errors[name] ? "border-red-500" : "",
          "block w-full appearance-none placeholder-[#FFFFFF]/50",
          className || ""
        )}
      />
    </>
  )
}
