import CheckIcon from "public/icons/check.svg"
import { FC, useState } from "react"

interface SortListPopupProps {
  orderType: string
  orderDirection: string
  onSave: (selection: string) => void
}

const SortListPopup: FC<SortListPopupProps> = ({
  orderType,
  orderDirection,
  onSave
}) => {
  const [orderTypeInner, setOrderTypeInner] = useState(orderType)
  const [orderDirectionInner, setOrderDirectionInner] = useState(orderDirection)

  const handleChangeOrderingSelection = (
    orderType: string,
    orderDirection: string
  ) => {
    setOrderTypeInner(orderType)
    setOrderDirectionInner(orderDirection)
  }

  return (
    <div className="w-[254px] rounded-[20px] border border-[rgba(255,255,255,0.15)] bg-[#1B141D] p-[26px] backdrop-blur-[15px]">
      <span className="mb-3 block">Sort by</span>
      <ul className="flex w-full flex-col gap-[12px]">
        <li
          className="flex w-full cursor-pointer items-center justify-between text-passes-gray-800"
          onClick={() => handleChangeOrderingSelection("name", "asc")}
        >
          <span>Name</span>
          {orderTypeInner === "name" ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-passes-primary-color">
              <CheckIcon className="h-3 w-3" />
            </span>
          ) : (
            <span className="h-4 w-4 rounded-full border border-passes-gray-900 bg-passes-dark-700" />
          )}
        </li>
        <li
          className="flex w-full cursor-pointer items-center justify-between text-passes-gray-800"
          onClick={() => handleChangeOrderingSelection("created at", "desc")}
        >
          <span>Date created: latest </span>
          {orderTypeInner !== "name" && orderDirectionInner === "desc" ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-passes-primary-color">
              <CheckIcon className="h-3 w-3" />
            </span>
          ) : (
            <span className="h-4 w-4 rounded-full border border-passes-gray-900 bg-passes-dark-700" />
          )}
        </li>
        <li
          className="flex w-full cursor-pointer items-center justify-between text-passes-gray-800"
          onClick={() => handleChangeOrderingSelection("created at", "asc")}
        >
          <span>Date created: earliest</span>
          {orderTypeInner !== "name" && orderDirectionInner === "asc" ? (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-passes-primary-color">
              <CheckIcon className="h-3 w-3" />
            </span>
          ) : (
            <span className="h-4 w-4 rounded-full border border-passes-gray-900 bg-passes-dark-700" />
          )}
        </li>
      </ul>
      <button
        className="mt-6 flex w-full items-center justify-center rounded-[50px] bg-passes-primary-color py-2 text-base font-bold leading-6"
        onClick={() => onSave(`${orderTypeInner}:${orderDirectionInner}`)}
      >
        Save
      </button>
    </div>
  )
}

export default SortListPopup
