import classNames from "classnames"
import FilterLines from "public/icons/filter-lines.svg"
import React, { FC, useRef, useState } from "react"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

export interface Order {
  name: string
  id: string
}

interface OrderDropDownProps {
  orders: Order[]
  activeOrder: Order["id"]
  setActiveOrder: (order: Order["id"]) => void
}

export const OrderDropDown: FC<OrderDropDownProps> = ({
  orders,
  activeOrder,
  setActiveOrder
}) => {
  const [showOrderDropDown, setShowOrderDropDown] = useState(false)

  const orderRef = useRef(null)
  useOnClickOutside(orderRef, () => {
    setShowOrderDropDown(false)
  })

  const activeOrderHandler = (order: Order["id"]) => {
    setActiveOrder(order)
    setShowOrderDropDown(false)
  }

  return (
    <div className="relative inline-block" ref={orderRef}>
      <button
        className="flex items-center space-x-[5px]"
        onClick={() => setShowOrderDropDown((show) => !show)}
      >
        <FilterLines />
        <span className="text-base font-medium">
          {orders.find(({ id }) => id === activeOrder)?.name}
        </span>
      </button>

      {showOrderDropDown && (
        <ul className="text-label absolute left-[17px] z-10 translate-y-3 whitespace-nowrap rounded-md border border-passes-dark-200 bg-passes-dark-700 py-2.5 px-3">
          {orders.map(({ id, name }, i) => (
            <li
              key={id}
              className={classNames(
                // first element
                i === 0
                  ? "border-b border-passes-dark-200 pb-2.5"
                  : // last element
                  i === orders.length - 2
                  ? "pt-2.5"
                  : "border-b border-passes-dark-200 py-2.5"
              )}
            >
              <button onClick={() => activeOrderHandler(id)}>{name}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
