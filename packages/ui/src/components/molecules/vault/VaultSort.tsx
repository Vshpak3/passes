import { Menu, Transition } from "@headlessui/react"
import {
  GetVaultQueryRequestDtoOrderEnum,
  GetVaultQueryResponseDtoOrderEnum
} from "@passes/api-client"
import classNames from "classnames"
import FilterIcon from "public/icons/three-lines-icon.svg"
import { FC, Fragment } from "react"

interface VaultSortDropdownProps {
  order: GetVaultQueryRequestDtoOrderEnum
  setOrder: (order: GetVaultQueryRequestDtoOrderEnum) => void
}

export interface OrderTypeOptionProp {
  name: "Recent"
  label?: string
}
export interface OrderOptionProp {
  name: GetVaultQueryResponseDtoOrderEnum
  label?: string
}

const orderTypes: OrderTypeOptionProp[] = [
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  { name: "Recent", label: "Recent" }
]
const orders: OrderOptionProp[] = [
  { name: GetVaultQueryResponseDtoOrderEnum.Asc, label: "Ascending" },
  { name: GetVaultQueryResponseDtoOrderEnum.Desc, label: "Descending" }
]

export const VaultSortDropdown: FC<VaultSortDropdownProps> = ({
  order,
  setOrder
}) => {
  return (
    <Menu as="div" className="relative px-3">
      <div className="flex items-center justify-center gap-3 opacity-70 hover:opacity-100">
        <Menu.Button>
          <FilterIcon />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 top-10 z-10 mt-2 box-border flex w-36 origin-top-right flex-col items-start justify-start gap-[10px] rounded-md border border-[#2C282D] bg-[#100C11]/50 p-[10px] backdrop-blur-[100px]">
          <hr />
          {orderTypes.map((item: OrderTypeOptionProp) => (
            <Menu.Item key={item.name}>
              <div
                className={classNames(
                  "bg-[#9C4DC1]",
                  "flex w-full cursor-pointer rounded p-1 text-base text-[#FFFF] ring-0 focus:shadow-none focus:ring-0 focus:ring-offset-0"
                )}
              >
                {item.label}
              </div>
            </Menu.Item>
          ))}
          {orders.map((item: OrderOptionProp) => (
            <Menu.Item key={item.name}>
              <div
                onClick={() => setOrder(item.name)}
                className={classNames(
                  order === item.name ? "bg-[#9C4DC1]" : "bg-transparent",
                  "flex w-full cursor-pointer rounded p-1 text-base text-[#FFFF] ring-0 focus:shadow-none focus:ring-0 focus:ring-offset-0"
                )}
              >
                {item.label}
              </div>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
