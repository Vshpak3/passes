import { PassDtoTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import ArrowDown from "public/icons/post-audience-chevron-icon.svg"
import { FC, useEffect, useRef, useState } from "react"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

const PASS_DROPDOWN_OPTIONS = [
  {
    value: undefined,
    label: "All Pass Types"
  },
  {
    value: PassDtoTypeEnum.Lifetime,
    label: "Lifetime Passes"
  },
  {
    value: PassDtoTypeEnum.Subscription,
    label: "Subscription Passes"
  }
]

type PassFilterOption = {
  value?: PassDtoTypeEnum
  label: string
}

interface SelectPassFilterProps {
  setPassType: React.Dispatch<React.SetStateAction<PassDtoTypeEnum | undefined>>
  passType?: PassDtoTypeEnum
}

export const SelectPassFilter: FC<SelectPassFilterProps> = ({
  setPassType,
  passType
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const menuEl = useRef(null)

  const [selectedValue, setSelectedValue] = useState<PassFilterOption>()

  useEffect(() => {
    const [label] = PASS_DROPDOWN_OPTIONS.filter(
      ({ value }) => value === passType
    )
    setSelectedValue(label)
    setShowOptions(false)
  }, [passType])

  useOnClickOutside(menuEl, () => setShowOptions(false))

  return (
    <div className="text-label relative inline-block" ref={menuEl}>
      <div
        role="button"
        onClick={() => setShowOptions(true)}
        className="flex w-[220px] cursor-pointer space-x-6 rounded-[6px] border border-passes-dark-200 p-2.5 focus:border-passes-blue-100 md:space-x-14"
      >
        <span>{selectedValue?.label}</span>
        <ArrowDown />
      </div>
      {showOptions && (
        <ul className="absolute z-10 w-full translate-y-1.5 space-y-2.5 rounded-md border border-passes-dark-200 bg-passes-dark-700 py-2.5 px-3">
          {PASS_DROPDOWN_OPTIONS.map(({ value, label }, i) => (
            <li
              key={value}
              className={classNames(
                "cursor-pointer",
                i !== PASS_DROPDOWN_OPTIONS.length - 1
                  ? "border-b border-passes-dark-200 pb-2.5"
                  : ""
              )}
              onClick={() => {
                setShowOptions(false)
                setPassType(value)
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
