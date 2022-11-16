import { RadioGroup } from "@headlessui/react"
import { FC } from "react"
import { FieldValues, UseFormRegister } from "react-hook-form"

import { Checkbox } from "src/components/atoms/input/Checkbox"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { PassesSectionTitle } from "src/components/atoms/passes/CreatePass"

interface PassDirectMessageProps {
  register: UseFormRegister<FieldValues>
  passValue?: string | null
  setPassValue?: (value: string | null) => void
}

enum MessageTypesEnum {
  NUMBER = "numberMessages",
  UNLIMITED = "unlimitedMessages",
  NO_FREE_MESSAGE = "noFreeMessage"
}

export const PassDirectMessage: FC<PassDirectMessageProps> = ({
  register,
  setPassValue,
  passValue
}) => (
  <>
    <hr className="border-passes-dark-200" />
    <div className="mb-2">
      <PassesSectionTitle title="Direct messages" />
    </div>
    <RadioGroup onChange={setPassValue} value={passValue}>
      <RadioGroup.Option value={MessageTypesEnum.UNLIMITED}>
        {() => (
          <Checkbox
            checked={passValue === MessageTypesEnum.UNLIMITED}
            className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-passes-gray dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            label="Unlimited free messages"
            labelClassName="text-left text-[16px] text-white/90"
            name={MessageTypesEnum.UNLIMITED}
            register={register}
            type="radio"
          />
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value={MessageTypesEnum.NUMBER}>
        {() => (
          <div className="flex items-center">
            <Checkbox
              checked={passValue === MessageTypesEnum.NUMBER}
              className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-passes-gray dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              label="Set number of free messages per month"
              labelClassName="text-left text-[16px] text-white/90"
              name={MessageTypesEnum.NUMBER}
              register={register}
              type="radio"
            />
            <div className="ml-10 flex items-center justify-center">
              <NumberInput
                className="min-h-[50px] max-w-[140px] border-passes-dark-200 bg-transparent p-0 pl-[60px] text-white/90"
                name="free-dms-month"
                register={register}
                type="integer"
              />
            </div>
          </div>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value={MessageTypesEnum.NO_FREE_MESSAGE}>
        {() => (
          <Checkbox
            checked={passValue === MessageTypesEnum.NO_FREE_MESSAGE}
            className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-passes-gray dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            label="No free messages"
            labelClassName="text-left text-[16px] text-white/90"
            name={MessageTypesEnum.NO_FREE_MESSAGE}
            register={register}
            type="radio"
          />
        )}
      </RadioGroup.Option>
    </RadioGroup>
  </>
)
