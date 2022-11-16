import { FC } from "react"
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister
} from "react-hook-form"

import { NumberInput } from "src/components/atoms/input/NumberInput"
import { PassFormError } from "src/components/atoms/passes/CreatePass"

type FieldErrors<TFieldValues extends FieldValues = FieldValues> = DeepMap<
  TFieldValues,
  FieldError
>

interface PassPriceProps {
  register: UseFormRegister<FieldValues>
  errors?: FieldErrors
}

export const PassPrice: FC<PassPriceProps> = ({ register, errors }) => {
  return (
    <>
      <hr className="border-passes-dark-200" />
      <div className="flex w-fit items-center justify-start">
        <span className="w-[250px] text-lg font-bold text-white/90 md:text-[15px] md:font-[500]">
          Set price of the pass
        </span>
        <NumberInput
          className="ml-2 min-h-[50px] max-w-[140px] border-passes-dark-200 bg-transparent pr-[40px] text-right text-white/90"
          name="price"
          register={register}
          type="currency"
        />
        {errors?.price?.type === "required" && (
          <PassFormError message="Price is required" />
        )}
      </div>
    </>
  )
}
