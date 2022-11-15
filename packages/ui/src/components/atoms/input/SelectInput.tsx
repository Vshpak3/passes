import { Controller } from "react-hook-form"

import { Select, SelectProps } from "src/components/atoms/input/Select"

interface SelectInputProps extends Omit<SelectProps, "register"> {
  control: any // eslint-disable-line @typescript-eslint/no-explicit-any
  name: string
}

export const SelectInput = ({
  control,
  name,
  ...restOfProps
}: SelectInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange } }) => (
        <Select name={name} onChange={onChange} {...restOfProps} />
      )}
    />
  )
}
