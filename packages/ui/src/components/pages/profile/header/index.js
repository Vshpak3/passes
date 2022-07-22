import { Menu, Transition } from "@headlessui/react"
import ChevronDown from "public/icons/header-chevron-down-icon.svg"
import SearchIcon from "public/icons/header-search-icon.svg"
import React, { Fragment } from "react"
import { HeaderChatButton } from "src/components/common/Buttons"
import { classNames } from "src/helpers/classNames"

const ProfileHeader = () => {
  const userNavigation = [
    { name: "Your Profile", href: "#" },
    { name: "Settings", href: "#" },
    { name: "Sign out", href: "#" }
  ]
  return (
    <div className="hidden items-center justify-end gap-2 pl-4 pt-4 md:flex">
      <div className="flex items-center gap-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none  absolute top-1/2 left-[14px] -translate-y-1/2 transform" />
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Find creator"
            className="form-input h-[51px] w-full min-w-[296px] rounded-md border border-[#ffffff]/10 bg-[#1b141d]/50 pl-14 outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:border-[#ffffff]/10 focus:ring-0  "
          />
        </div>
        <div>
          <HeaderChatButton name="Chat" />
        </div>
        <div className="z-50 pl-4 pr-10">
          <Menu as="div" className="relative">
            <div className="flex items-center justify-center gap-3">
              <Menu.Button>
                <img // eslint-disable-line @next/next/no-img-element
                  className="w-[34px h-[34px]"
                  src="/pages/profile/header-profile-photo.png"
                  alt=""
                />
              </Menu.Button>
              <Menu.Button>
                <ChevronDown />
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
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}
export default ProfileHeader
