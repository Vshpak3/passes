import { PassDtoTypeEnum } from "@passes/api-client"
import _ from "lodash"
import ChevronDown from "public/icons/chevron-down.svg"
import { FC, useEffect, useRef, useState } from "react"

import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { SelectPassFilterItem } from "./SelectPassFilterItem"

const PASS_DROPDOWN_OPTIONS = [
  {
    value: PassDtoTypeEnum.External,
    label: "Whitelisted Communities"
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

interface SelectPassFilterProps {
  onPassTypeSelect(value: Array<PassDtoTypeEnum>): void
  passTypes: Array<PassDtoTypeEnum>
}

export const SelectPassFilter: FC<SelectPassFilterProps> = ({
  onPassTypeSelect,
  passTypes
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const menuEl = useRef(null)

  const [selectedValues, setSelectedValues] =
    useState<Array<PassDtoTypeEnum>>(passTypes)

  const handleOnChange = (passType: PassDtoTypeEnum) => {
    const temp = _.clone(selectedValues)
    if (!temp.includes(passType)) {
      temp.push(passType)
    } else {
      _.remove(temp, (value) => value === passType)
    }

    setSelectedValues(temp)
  }

  useOnClickOutside(menuEl, () => setShowOptions(false))

  useEffect(() => {
    setSelectedValues(passTypes)
  }, [showOptions, passTypes])

  const handleConfirm = () => {
    onPassTypeSelect(selectedValues)

    setShowOptions(false)
  }

  return (
    <div className="text-label relative inline-block" ref={menuEl}>
      <div
        role="button"
        onClick={() => setShowOptions(!showOptions)}
        className="flex cursor-pointer items-center space-x-6 rounded-[6px] border border-passes-dark-200 p-2.5 focus:border-passes-blue-100 md:space-x-14"
      >
        <span>All Pass Types</span>
        <span className={showOptions ? "scale-y-[-1]" : ""}>
          <ChevronDown />
        </span>
      </div>
      {showOptions && (
        <ul className="absolute z-10 w-[338px] translate-y-1.5 rounded-[15px] border border-passes-dark-200 bg-[#1B141D] p-[26px]">
          <li className="mb-[18px] text-[16px] underline">All Pass Types</li>
          {PASS_DROPDOWN_OPTIONS.map((passType, i) => (
            <SelectPassFilterItem
              value={passType.value}
              label={passType.label}
              onClick={handleOnChange}
              checked={selectedValues.includes(passType.value)}
              key={i}
            />
          ))}
          <li
            className="cursor-pointer rounded-[50px] bg-[#C943A8] p-[12px] text-center"
            onClick={handleConfirm}
          >
            Confirm
          </li>
        </ul>
      )}
    </div>
  )
}
