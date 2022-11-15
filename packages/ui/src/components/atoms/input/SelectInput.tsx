import React from "react"
import { Controller } from "react-hook-form"

import { FormAutoComplete } from "src/components/atoms/input/InputTypes"
import { Select, SelectProps } from "src/components/atoms/input/Select"

interface SelectInputProps extends SelectProps {
  autoComplete: FormAutoComplete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any
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
