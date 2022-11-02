import classNames from "classnames"
import { FC } from "react"

import { Button } from "src/components/atoms/Button"
import { Checkbox } from "src/components/atoms/Checkbox"
import { FormInput } from "src/components/atoms/FormInput"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { FormErrors, FormRegister } from "src/components/types/FormTypes"

interface PassFormErrorProps {
  message: string
  className?: string
}

export const PassFormError: FC<PassFormErrorProps> = ({
  message,
  className = ""
}) => (
  <div className={`text-md font-semibold text-[#ba3333] ${className}`}>
    {message}
  </div>
)

interface PassFormCheckboxProps {
  label: string
  name: string
  register: FormRegister
}

export const PassFormCheckbox: FC<PassFormCheckboxProps> = ({
  label,
  name,
  register
}) => (
  <div className="my-3 flex items-center">
    <Checkbox
      register={register}
      type="checkbox"
      name={name}
      label={label}
      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-passes-primary-color focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
    />
  </div>
)

interface PassNumberInputProps {
  register: FormRegister
  title: string
  name: string
  placeholder: string
  suffix?: string | number
  className: string
}

export const PassNumberInput: FC<PassNumberInputProps> = ({
  register,
  title,
  name,
  placeholder = "",
  suffix,
  className
}) => (
  <div className="my-2 grid w-fit auto-cols-auto grid-flow-col grid-rows-1">
    <div className="align-items flex w-[100px] items-center md:w-[200px]">
      <span className="text-[#ffff]/70">{title}</span>
    </div>
    <div className="grid grid-flow-col">
      <div className="align-items relative flex w-fit items-center justify-start">
        <NumberInput
          type="integer"
          register={register}
          name={name}
          placeholder={placeholder}
          className={classNames(
            "max-w-[140px] border-passes-dark-200 bg-transparent p-0 text-[#ffff]/90",
            className
          )}
        />
        {suffix && (
          <span className="absolute top-1/2 right-[40px] -translate-y-1/2 text-[#ffff]/90">
            {suffix}
          </span>
        )}
      </div>
    </div>
  </div>
)

interface PassesSectionTitleProps {
  title: string
}

export const PassesSectionTitle: FC<PassesSectionTitleProps> = ({ title }) => (
  <span className="mb-2 text-lg font-bold text-[#ffff]/90">{title}</span>
)

interface CreatePassButtonProps {
  onCreateHandler: () => void
  isDisabled?: boolean
}

export const CreatePassButton: FC<CreatePassButtonProps> = ({
  onCreateHandler,
  isDisabled
}) => (
  <div className="align-end my-6 flex justify-end md:my-0">
    <Button
      className="w-full border-none !py-4 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white md:w-[195px]"
      variant="pink"
      fontSize={16}
      onClick={onCreateHandler}
      disabled={isDisabled}
    >
      Create Pass
    </Button>
  </div>
)

interface CreatePassHeaderProps {
  title: string
}

export const CreatePassHeader: FC<CreatePassHeaderProps> = ({ title }) => (
  <div className="col-span-12 lg:col-span-10">
    <div className="mb-4 grow justify-center text-center text-[20px] font-bold leading-[25px] md:text-[24px]">
      <span className="text-[#ffff]/90">{title}</span>
    </div>
  </div>
)

interface PassDescriptionInputProps {
  register: FormRegister
  errors: FormErrors
}

export const PassDescriptionInput: FC<PassDescriptionInputProps> = ({
  register,
  errors
}) => (
  <>
    <PassesSectionTitle title="Add description" />
    <FormInput
      register={register}
      type="text"
      name="passDescription"
      className="m-0 w-full border-passes-dark-200 bg-transparent p-0 text-[#ffff]/90"
      placeholder="Type a caption here that describes the pass"
    />
    {errors.passDescription?.type === "required" && (
      <PassFormError message="Description is required" />
    )}
  </>
)

interface PassNameInputProps {
  register: FormRegister
  errors: FormErrors
}

export const PassNameInput: FC<PassNameInputProps> = ({ register, errors }) => (
  <>
    <PassesSectionTitle title="Name this pass" />
    <FormInput
      register={register}
      type="text"
      name="passName"
      className="flex-grow-1 m-0 border-passes-dark-200 bg-transparent p-0 text-[#ffff]/90"
      placeholder="Name of your new pass!"
    />
    {errors.passName?.type === "required" && (
      <PassFormError message="Name is required" />
    )}
  </>
)
