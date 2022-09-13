import { Menu, Transition } from "@headlessui/react"
import classNames from "classnames"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import React, { Dispatch, Fragment, SetStateAction } from "react"

import { List } from "../../organisms/DirectMessage"

interface IListsDropdown {
  lists: List[]
  onSelectList: Dispatch<SetStateAction<any>>
}
export const ListsDropdown = ({ lists, onSelectList }: IListsDropdown) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-[#2C282D] bg-transparent px-4  py-[10px] text-[16px] text-sm font-medium leading-[25px] text-white shadow-sm outline-0 ring-0 hover:bg-transparent focus:outline-none focus:ring-0 ">
          Select Audience
          <ChevronDown className="ml-2 h-6 w-6" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-[175px] origin-top-right rounded-md border border-passes-dark-100 bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
          <div className="py-1">
            {lists.map((list, index) => (
              <div key={index}>
                <Menu.Item>
                  {({ active }) => (
                    <span
                      key={index}
                      onClick={() => onSelectList(list)}
                      className={classNames(
                        active ? "text-white" : "",
                        "mx-3 block cursor-pointer border-b border-[#2C282D] py-2 text-sm text-[16px] font-medium leading-[25px] hover:bg-[#ffffff]/10"
                      )}
                    >
                      {list.name}
                    </span>
                  )}
                </Menu.Item>
              </div>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
