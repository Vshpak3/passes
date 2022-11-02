import { PassDtoTypeEnum } from "@passes/api-client"
import ChevronDown from "public/icons/chevron-down.svg"
import { Dispatch, FC, SetStateAction, useRef, useState } from "react"

import { useOnClickOutside } from "src/hooks/useOnClickOutside"

export type PassType = PassDtoTypeEnum | undefined

interface SelectPassFilterProps {
  onSelectedPassType: Dispatch<SetStateAction<PassType>>
}

const PASS_DROPDOWN_OPTIONS: { value: PassType; label: string }[] = [
  {
    value: undefined,
    label: "All Memberships"
  },
  {
    value: PassDtoTypeEnum.Subscription,
    label: "Subscriptions"
  },
  {
    value: PassDtoTypeEnum.Lifetime,
    label: "Lifetime Memberships"
  },
  {
    value: PassDtoTypeEnum.External,
    label: "Whitelisted Communities"
  }
]

export const SelectPassFilter: FC<SelectPassFilterProps> = ({
  onSelectedPassType
}) => {
  const [selectedPassType, setSelectedPassType] = useState<PassType>(undefined)

  const [showOptions, setShowOptions] = useState(false)
  const menuEl = useRef(null)

  const handleOnChange = (_selectedPassType: PassType) => {
    setSelectedPassType(_selectedPassType)
    onSelectedPassType(_selectedPassType)
  }

  useOnClickOutside(menuEl, () => setShowOptions(false))

  return (
    <div className="text-label relative mb-5 inline-block" ref={menuEl}>
      <div
        className="flex cursor-pointer items-center space-x-6 rounded-[6px] border border-passes-dark-200 p-2.5 focus:border-passes-blue-100 md:space-x-14"
        onClick={() => setShowOptions(!showOptions)}
        role="button"
      >
        <span>
          {
            PASS_DROPDOWN_OPTIONS.find((p) => p.value === selectedPassType)
              ?.label
          }
        </span>
        <span className={showOptions ? "scale-y-[-1]" : ""}>
          <ChevronDown />
        </span>
      </div>
      {showOptions && (
        <ul className="absolute z-10 w-[338px] translate-y-1.5 rounded-[15px] border border-passes-dark-200 bg-[#1B141D] p-[26px]">
          {PASS_DROPDOWN_OPTIONS.map((type, i) => (
            <li
              className="mb-[18px] flex cursor-pointer flex-row items-center justify-between"
              key={i}
              onClick={() => handleOnChange(type.value)}
            >
              {type.label}
              <input
                checked={type.value === selectedPassType}
                className="rounded-full bg-[#100C11] text-[#C943A8] outline-none checked:bg-[#C943A8]"
                onChange={() => handleOnChange(type.value)}
                type="checkbox"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
