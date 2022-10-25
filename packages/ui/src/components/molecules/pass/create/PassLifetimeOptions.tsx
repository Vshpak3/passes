import { FC } from "react"
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister
} from "react-hook-form"

import {
  PassFormError,
  PassNumberInput
} from "src/components/atoms/passes/CreatePass"

type FieldErrors<TFieldValues extends FieldValues = FieldValues> = DeepMap<
  TFieldValues,
  FieldError
>

interface PassLifetimeOptionsProps {
  register: UseFormRegister<FieldValues>
  errors?: FieldErrors
}

export const PassLifetimeOptions: FC<PassLifetimeOptionsProps> = ({
  register,
  errors
}) => {
  return (
    <>
      <hr className="border-passes-dark-200" />
      <div className="grid grid-rows-2 gap-1">
        <PassNumberInput
          suffix="%"
          register={register}
          // errors={errors}
          title="Set royalties % on re-sales"
          name="royalties"
          placeholder="0.00"
          className="pl-[50px]"
          // infoIcon
        />
        <PassNumberInput
          register={register}
          title="Set amount of total supply"
          name="totalSupply"
          placeholder="0.00"
          className="pl-[50px]"
        />
        {errors?.royalties ||
          (errors?.totalSupply && (
            <PassFormError
              message={errors?.royalties.message || errors?.totalSupply.message}
            />
          ))}
      </div>
    </>
  )
}
