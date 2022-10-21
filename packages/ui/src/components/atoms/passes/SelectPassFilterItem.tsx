import { PassDtoTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import { useState } from "react"

interface SelectPassFilterItemProps {
  value: PassDtoTypeEnum
  label: string
  onClick(value: PassDtoTypeEnum): void
  checked: boolean
}

export const SelectPassFilterItem = ({
  value,
  label,
  checked,
  onClick
}: SelectPassFilterItemProps) => {
  const [selected, setSelected] = useState<boolean>(checked)
  const handleOnClick = () => {
    setSelected((pre) => !pre)
    onClick(value)
  }

  return (
    <li
      key={value}
      className={classNames(
        "mb-[18px] flex flex-row items-center justify-between"
      )}
    >
      {label}
      <input
        type="checkbox"
        className="border-[ #D0D5DD] rounded-[6px] border bg-[#100C11] text-[#C943A8] outline-none checked:bg-[#C943A8]"
        checked={selected}
        onChange={handleOnClick}
      />
    </li>
  )
}
