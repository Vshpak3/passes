import classNames from "classnames"
import React, { useEffect, useRef, useState } from "react"
import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormRegister
} from "src/components/types/FormTypes"

import Label from "./Label"

type TextAreaProps = {
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

const TextArea = ({
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
}: TextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [keyDownEvent, setKeyDownEvent] = useState<any>(null)
  const { ref, ...reg } = register(name, {
    ...options,
    onChange: (event: any) => {
      if (options.onChange) {
        options.onChange(event, keyDownEvent)
      }
    }
  })
  useEffect(() => {
    if (textAreaRef.current) {
      const keyDownEvent = function (event: any) {
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
      {label && (
        <Label name={name} label={label} errors={errors} options={options} />
      )}
      <textarea
        id={name}
        placeholder={placeholder}
        name={name}
        rows={rows}
        cols={cols}
        ref={(r) => {
          ref(r)
          textAreaRef.current = r
        }}
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
export default TextArea
