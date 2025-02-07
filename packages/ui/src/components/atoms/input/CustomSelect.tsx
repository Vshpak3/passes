import { Listbox, Transition } from "@headlessui/react"
import classNames from "classnames"
import { FC, Fragment, useCallback, useEffect, useState } from "react"
import { Controller } from "react-hook-form"

import {
  FormErrors,
  FormLabel,
  FormName,
  FormOptions,
  FormPlaceholder
} from "src/components/atoms/input/InputTypes"
import { Label } from "src/components/atoms/Label"
import { ChevronDown } from "src/icons/ChevronDown"

export type SelectOption = {
  value: string | number | undefined | boolean
  label: string | JSX.Element
}

type FormSelectOption = string | SelectOption
type FormSelectOptions = Array<FormSelectOption>

type SelectProps = {
  label?: FormLabel
  name: FormName
  options?: FormOptions
  errors?: FormErrors
  value?: string
  defaultValue?: FormSelectOption
  placeholder?: FormPlaceholder
  selectOptions?: FormSelectOptions
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void
  placeholderClass?: string
  showOnTop?: boolean
  changeOnDefault?: boolean
  transparent?: boolean
}

const Select: FC<SelectProps> = ({
  name,
  label,
  errors = {},
  options,
  selectOptions,
  placeholder = "",
  className = "",
  defaultValue = "",
  onChange,
  showOnTop = false,
  changeOnDefault = false,
  transparent = true,
  ...rest
}) => {
  const isString = typeof defaultValue === "string"
  const defaultDisplay = isString ? defaultValue : defaultValue.label
  const [displayedValue, setDisplayedValue] = useState(defaultDisplay)

  useEffect(() => {
    if (changeOnDefault) {
      setDisplayedValue(defaultDisplay)
    }
  }, [changeOnDefault, defaultDisplay])

  const onCustomChange = useCallback(
    (option: FormSelectOption) => {
      const isString = typeof option === "string"

      setDisplayedValue(isString ? option : option.label)
      onChange?.(isString ? option : (option.value as string))
    },
    [setDisplayedValue, onChange]
  )

  return (
    <div className="relative">
      {!!label && (
        <Label errors={errors} label={label} name={name} options={options} />
      )}
      <Listbox defaultValue={defaultValue} onChange={onCustomChange} {...rest}>
        <Listbox.Button
          className={classNames(
            "my-1 flex min-h-[50px] w-full appearance-none items-center justify-between rounded-md border px-4 py-3 text-left text-sm invalid:text-gray-400 focus:border-passes-pink-100/80 focus:ring-passes-pink-100/80",
            className,
            transparent ? "bg-transparent" : "bg-black",
            errors?.[name] ? "border-red-500" : "border-passes-dark-100",
            { "text-gray-500": !displayedValue && placeholder }
          )}
        >
          <span>{displayedValue || placeholder}</span>
          <ChevronDown className="h-3 w-3 text-passes-gray-200" />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={classNames(
              "absolute z-10 max-h-[200px] w-full overflow-y-auto rounded-md border border-passes-dark-100 bg-[#000]",
              { "bottom-full": showOnTop }
            )}
          >
            <div className="my-1" />
            {selectOptions?.map((option) => (
              <Listbox.Option
                className={({ active }) =>
                  classNames("p1-2 block cursor-pointer py-1 px-4", {
                    "bg-[#12070E]/90 text-passes-primary-color": active
                  })
                }
                key={typeof option === "string" ? option : option.value + ""}
                value={option}
              >
                <span>
                  {typeof option === "string" ? option : option.label}
                </span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
      {!!errors?.[name] && (
        <span className="text-xs text-red-500">{errors[name].message}</span>
      )}
    </div>
  )
}

interface CustomSelectProps extends SelectProps {
  control?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

// eslint-disable-next-line react/no-multi-comp
export const CustomSelect = ({
  control = undefined,
  name,
  ...restOfProps
}: CustomSelectProps) => {
  return (
    <>
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange } }) => (
            <Select name={name} onChange={onChange} {...restOfProps} />
          )}
        />
      ) : (
        <Select name={name} {...restOfProps} />
      )}
    </>
  )
}
