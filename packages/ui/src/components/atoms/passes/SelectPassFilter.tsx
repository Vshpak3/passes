import { PassDtoTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import _ from "lodash"
import ChevronDown from "public/icons/chevron-down.svg"
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react"

import { useOnClickOutside } from "src/hooks/useOnClickOutside"

interface SelectPassFilterProps {
  selectedPassType?: PassDtoTypeEnum | undefined
  onSelectedPassType: Dispatch<SetStateAction<PassDtoTypeEnum | undefined>>
}

const PASS_DROPDOWN_OPTIONS = [
  {
    value: undefined,
    label: "All Passes"
  },
  {
    value: PassDtoTypeEnum.Subscription,
    label: "Subscription Passes"
  },
  {
    value: PassDtoTypeEnum.Lifetime,
    label: "Lifetime Passes"
  },
  {
    value: PassDtoTypeEnum.External,
    label: "Whitelisted Communities"
  }
]

export const SelectPassFilter: FC<SelectPassFilterProps> = ({
  onSelectedPassType
}) => {
  const [selectedPassType, setSelectedPassType] = useState<
    PassDtoTypeEnum | undefined
  >()

  const [showOptions, setShowOptions] = useState(false)
  const menuEl = useRef(null)

  const handleOnChange = (_selectedPassType: PassDtoTypeEnum | undefined) => {
    setSelectedPassType(_selectedPassType)
    onSelectedPassType(_selectedPassType)
  }

  useOnClickOutside(menuEl, () => setShowOptions(false))

  return (
    <div className="text-label relative mb-5 inline-block" ref={menuEl}>
      <div
        role="button"
        onClick={() => setShowOptions(!showOptions)}
        className="flex cursor-pointer items-center space-x-6 rounded-[6px] border border-passes-dark-200 p-2.5 focus:border-passes-blue-100 md:space-x-14"
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
              key={i}
              className="mb-[18px] flex cursor-pointer flex-row items-center justify-between"
              onClick={() => handleOnChange(type.value)}
            >
              {type.label}
              <input
                type="checkbox"
                className="rounded-full bg-[#100C11] text-[#C943A8] outline-none checked:bg-[#C943A8]"
                checked={type.value === selectedPassType}
                onChange={() => handleOnChange(type.value)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
