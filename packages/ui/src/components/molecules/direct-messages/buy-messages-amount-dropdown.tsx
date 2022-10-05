import { Menu, Transition } from "@headlessui/react"
import classNames from "classnames"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import React, { Dispatch, Fragment, SetStateAction } from "react"

interface IAmountsDropdown {
  selectedAmount: number
  amounts: any
  onSelectAmount: Dispatch<SetStateAction<any>>
}
export const BuyMessagesAmountDropdown = ({
  selectedAmount,
  amounts,
  onSelectAmount
}: IAmountsDropdown) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-[10px] rounded-md border border-[#2C282D] bg-transparent px-[10px]  py-[10px] text-xl font-medium text-[#C943A8] shadow-sm outline-0 ring-0 hover:bg-transparent focus:outline-none focus:ring-0 ">
          {selectedAmount}
          <ChevronDown className=" h-6 w-6" />
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
        <Menu.Items className="absolute right-0 left-0 z-10 mt-2 origin-top-right rounded-md border border-passes-dark-100 bg-transparent shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-3xl focus:outline-none ">
          <div className="py-1">
            {amounts.map(
              (amount: number, index: React.Key | null | undefined) => (
                <div key={index}>
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        key={index}
                        onClick={() => onSelectAmount(amount)}
                        className={classNames(
                          active ? "text-white" : "",
                          "block cursor-pointer py-2 pl-3 text-sm text-[16px] font-medium leading-[25px] text-white hover:bg-[#ffffff]/10"
                        )}
                      >
                        {amount}
                      </span>
                    )}
                  </Menu.Item>
                </div>
              )
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
