import { RadioGroup } from "@headlessui/react"
import { FC } from "react"
import {
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister
} from "react-hook-form"

import { Checkbox } from "src/components/atoms/input/Checkbox"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import {
  PassesSectionTitle,
  PassFormError
} from "src/components/atoms/passes/CreatePass"

type FieldErrors<TFieldValues extends FieldValues = FieldValues> = DeepMap<
  TFieldValues,
  FieldError
>

interface PassSupplyProps {
  register: UseFormRegister<FieldValues>
  passValue?: string | null
  setPassValue?: (value: string | null) => void
  errors?: FieldErrors
}

enum SupplyTypesEnum {
  UNLIMITED = "unlimited",
  TOTAL_SUPPLY = "totalSupply"
}

export const PassSupply: FC<PassSupplyProps> = ({
  register,
  errors,
  passValue,
  setPassValue
}) => {
  return (
    <>
      <hr className="border-passes-dark-200" />
      <div>
        <div className="mb-[20px]">
          <PassesSectionTitle title="Supply" />
        </div>
        <RadioGroup onChange={setPassValue} value={passValue}>
          <RadioGroup.Option value={SupplyTypesEnum.UNLIMITED}>
            {() => (
              <Checkbox
                checked={passValue === SupplyTypesEnum.UNLIMITED}
                className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color"
                label="Unlimited"
                labelClassName="text-left text-[16px] text-white/90"
                name={SupplyTypesEnum.UNLIMITED}
                register={register}
                type="radio"
              />
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value={SupplyTypesEnum.TOTAL_SUPPLY}>
            <div className="mt-[20px] flex items-center">
              <Checkbox
                checked={passValue === SupplyTypesEnum.TOTAL_SUPPLY}
                className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color"
                label="Set amount of total supply"
                labelClassName="text-left text-[16px] text-white/90"
                name={SupplyTypesEnum.TOTAL_SUPPLY}
                register={register}
                type="radio"
              />
              <div className="ml-10 flex items-center justify-center">
                <NumberInput
                  className="min-h-[50px] max-w-[140px] border-passes-dark-200 bg-transparent p-0 pl-[60px] text-white/90"
                  name="totalSupply"
                  register={register}
                  type="integer"
                />
                {errors?.totalSupply?.type === "totalSupply" && (
                  <PassFormError message="Total supply is required" />
                )}
              </div>
            </div>
          </RadioGroup.Option>
        </RadioGroup>
      </div>
    </>
  )
}
