import { Menu, Transition } from "@headlessui/react"
import classNames from "classnames"
import PostOptionsIcon from "public/icons/post-options-icon.svg"
import { FC, Fragment } from "react"

export interface DropdownOption {
  readonly text: string
  readonly handleClick: () => void
}

interface DropdownProps {
  readonly items: DropdownOption[]
  className?: string
}

export const Dropdown: FC<DropdownProps> = ({ items, className }) => {
  return (
    <Menu as="div" className="relative inline-block flex-1 text-left">
      <div className={classNames(className)}>
        <Menu.Button>
          <PostOptionsIcon className="min-w-[24px] cursor-pointer stroke-[#868487] hover:stroke-white" />
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
        <Menu.Items className="absolute right-0 z-[60] mt-2 w-36 origin-top-right rounded-md border border-passes-dark-100 bg-black shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="py-1">
            {items.map((item, index) => (
              <div key={index}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment  */}
                {/* @ts-ignore */}
                <Menu.Item key={index} onClick={item.handleClick}>
                  {({ active }) => (
                    <span
                      className={classNames(
                        active ? "text-passes-primary-color" : "text-[#868487]",
                        "block cursor-pointer px-4 py-2 text-sm"
                      )}
                    >
                      {item.text}
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
