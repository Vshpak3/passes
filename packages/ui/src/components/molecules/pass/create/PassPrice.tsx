import DollarIcon from "public/icons/profile-dollar-icon.svg"
import { FC } from "react"
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister
} from "react-hook-form"

import { FormInput } from "src/components/atoms/FormInput"
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
      <div className="align-items flex w-fit items-center justify-start">
        <span className="w-[250px] text-lg font-bold text-[#ffff]/90 md:text-[15px] md:font-semibold">
          Set price of the pass
        </span>
        <FormInput
          register={register}
          type="text"
          name="price"
          className="ml-2 max-w-[140px] border-passes-dark-200 bg-transparent pr-[40px] text-right text-[#ffff]/90"
          placeholder="0.00"
          icon={<DollarIcon className="ml-[20px]" />}
          iconMargin="50"
        />
        {errors?.price?.type === "required" && (
          <PassFormError message="Price is required" />
        )}
      </div>
    </>
  )
}
