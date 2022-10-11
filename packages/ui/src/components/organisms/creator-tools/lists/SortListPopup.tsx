import CheckIcon from "public/icons/check.svg"
import { FC, useState } from "react"

interface SortOption {
  orderType: string
  order: "desc" | "asc"
}
interface SortListPopupProps {
  defaultOption: SortOption
  options: SortOption[]
  onSave: (selection: string) => void
}

const orderOptionToText = ({ orderType, order }: SortOption) => {
  let text = ""
  switch (orderType) {
    case "username":
      text = "Username"
      break
    case "name":
      text = "Name"
      break
    case "created at":
      text = "Creation Date"
      break
  }
  text += "(" + order + ")"
  return text
}

export const SortListPopup: FC<SortListPopupProps> = ({
  defaultOption,
  options,
  onSave
}) => {
  const [orderTypeInner, setOrderTypeInner] = useState(defaultOption.orderType)
  const [orderInner, setOrderInner] = useState(defaultOption.order)

  const handleChangeOrderingSelection = (
    orderType: string,
    order: "desc" | "asc"
  ) => {
    setOrderTypeInner(orderType)
    setOrderInner(order)
  }

  return (
    <div className="w-[254px] rounded-[20px] border border-[rgba(255,255,255,0.15)] bg-[#1B141D] p-[26px] backdrop-blur-[15px]">
      <span className="mb-3 block">Sort by</span>
      <ul className="flex w-full flex-col gap-[12px]">
        {options.map(({ orderType, order }: SortOption) => {
          return (
            <li
              key={`${orderType}:${order}`}
              className="flex w-full cursor-pointer items-center justify-between text-passes-gray-800"
              onClick={() => handleChangeOrderingSelection(orderType, order)}
            >
              <span>{orderOptionToText({ orderType, order })}</span>
              {orderTypeInner === orderType && orderInner === order ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-passes-primary-color">
                  <CheckIcon className="h-3 w-3" />
                </span>
              ) : (
                <span className="h-4 w-4 rounded-full border border-passes-gray-900 bg-passes-dark-700" />
              )}
            </li>
          )
        })}
      </ul>
      <button
        className="mt-6 flex w-full items-center justify-center rounded-[50px] bg-passes-primary-color py-2 text-base font-bold leading-6"
        onClick={() => onSave(`${orderTypeInner}:${orderInner}`)}
      >
        Save
      </button>
    </div>
  )
}
