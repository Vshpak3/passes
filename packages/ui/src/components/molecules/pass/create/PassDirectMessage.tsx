import { RadioGroup } from "@headlessui/react"
import HashtagIcon from "public/icons/hashtag-icon.svg"
import { FC } from "react"
import { FieldValues, UseFormRegister } from "react-hook-form"

import { FormInput } from "src/components/atoms/FormInput"
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
    <RadioGroup value={passValue} onChange={setPassValue}>
      <RadioGroup.Option value={MessageTypesEnum.UNLIMITED}>
        {() => (
          <>
            <FormInput
              checked={passValue === MessageTypesEnum.UNLIMITED}
              register={register}
              label="Unlimited free messages"
              type="radio"
              name={MessageTypesEnum.UNLIMITED}
              labelClassName="text-left text-[16px] text-[#ffff]/90"
              className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
          </>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value={MessageTypesEnum.NUMBER}>
        {() => (
          <>
            <div className="align-center flex items-center">
              <FormInput
                checked={passValue === MessageTypesEnum.NUMBER}
                register={register}
                label="Set number of free messages per month"
                type="radio"
                name={MessageTypesEnum.NUMBER}
                labelClassName="text-left text-[16px] text-[#ffff]/90"
                className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <div className="align-center ml-10 flex items-center justify-center">
                <FormInput
                  register={register}
                  type="number"
                  name="free-dms-month"
                  className="max-w-[140px] border-passes-dark-200 bg-transparent p-0 pl-[60px] text-[#ffff]/90"
                  placeholder="0"
                  icon={<HashtagIcon />}
                />
              </div>
            </div>
          </>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value={MessageTypesEnum.NO_FREE_MESSAGE}>
        {() => (
          <>
            <FormInput
              checked={passValue === MessageTypesEnum.NO_FREE_MESSAGE}
              register={register}
              label="No free messages"
              type="radio"
              name={MessageTypesEnum.NO_FREE_MESSAGE}
              labelClassName="text-left text-[16px] text-[#ffff]/90"
              className="h-[14px] w-[14px] rounded-[50%] border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
          </>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  </>
)
