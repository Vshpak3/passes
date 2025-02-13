import { FC } from "react"

import { Input, InputProps } from "src/components/atoms/input/GeneralInput"

type PasswordInputProps = Omit<InputProps, "type">

export const PasswordInput: FC<PasswordInputProps> = (props) => {
  return <Input type="password" {...props} />
}
