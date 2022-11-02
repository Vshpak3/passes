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
        <RadioGroup value={passValue} onChange={setPassValue}>
          <RadioGroup.Option value={SupplyTypesEnum.UNLIMITED}>
            {() => (
              <Checkbox
                checked={passValue === SupplyTypesEnum.UNLIMITED}
                register={register}
                label="Unlimited"
                type="radio"
                name={SupplyTypesEnum.UNLIMITED}
                labelClassName="text-left text-[16px] text-[#ffff]/90"
                className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value={SupplyTypesEnum.TOTAL_SUPPLY}>
            <div className="align-center mt-[20px] flex items-center">
              <Checkbox
                checked={passValue === SupplyTypesEnum.TOTAL_SUPPLY}
                register={register}
                label="Set amount of total supply"
                type="radio"
                name={SupplyTypesEnum.TOTAL_SUPPLY}
                labelClassName="text-left text-[16px] text-[#ffff]/90"
                className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <div className="align-center ml-10 flex items-center justify-center">
                <NumberInput
                  type="integer"
                  register={register}
                  name="totalSupply"
                  className="max-w-[140px] border-passes-dark-200 bg-transparent p-0 pl-[60px] text-[#ffff]/90"
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
