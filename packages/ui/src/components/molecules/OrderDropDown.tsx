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
        <ul className="text-label absolute right-0 top-[35px] z-10 min-w-[260px] translate-y-3 whitespace-nowrap rounded-md border border-passes-dark-200 bg-passes-dark-700 px-5">
          <li className="pt-4">Sort By</li>
          {orders.map(({ id, name }) => (
            <li
              key={id}
              className="my-3 py-[10px] pl-4 text-[14px] font-medium leading-[20px] text-[#A7A7A7] hover:bg-[#191919] hover:text-white hover:shadow-sm"
            >
              <button onClick={() => activeOrderHandler(id)}>{name}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
