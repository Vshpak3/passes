import { FC } from "react"
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister
} from "react-hook-form"

import {
  PassFormCheckbox,
  PassFormError
} from "src/components/atoms/passes/CreatePass"

type FieldErrors<TFieldValues extends FieldValues = FieldValues> = DeepMap<
  TFieldValues,
  FieldError
>

interface PassProps {
  register: UseFormRegister<FieldValues>
  errors?: FieldErrors
}

export const PassFreeTrial: FC<PassProps> = ({ register, errors }) => {
  return (
    <div className="flex w-fit items-center justify-start">
      <PassFormCheckbox
        label=""
        name="free-dm-month-checkbox"
        register={register}
      />
      <span className="w-[250px] text-lg font-bold text-[#ffff]/90 md:text-[15px] md:font-[500]">
        Add free trial for first month
      </span>
      {errors?.price?.type === "free-dm-month-checkbox" && (
        <PassFormError message="Price is required" />
      )}
    </div>
  )
}
