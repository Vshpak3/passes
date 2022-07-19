import { Dialog, Disclosure, Transition } from "@headlessui/react"
import PlusSign from "public/icons/plus-sign.svg"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import CreatorToolsIcon from "public/icons/sidebar-creator-tools-icon.svg"
import GalleryIcon from "public/icons/sidebar-gallery-icon.svg"
import HomeIcon from "public/icons/sidebar-home-icon.svg"
import LogoSmall from "public/icons/sidebar-logo-small.svg"
import LogoutIcon from "public/icons/sidebar-logout-icon.svg"
import MessagesIcon from "public/icons/sidebar-messages-icon.svg"
import NotificationIcon from "public/icons/sidebar-notification-icon.svg"
import SettingsIcon from "public/icons/sidebar-settings-icon.svg"
import MomentLogo from "public/moment-logo.svg"
import UpdatedMomentLogo from "public/moment-logo-updated.svg"
import { Fragment, useState } from "react"

import { NewPostDialog } from "../../pages/profile/posts/new-post"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}
const SideBar = () => {
  const [active, setActive] = useState("home")
  const navigation = [
    { id: "home", name: "Home", href: "#", icon: HomeIcon, current: true },
    {
      id: "messages",
      name: "Messages",
      href: "#",
      icon: MessagesIcon,
      current: false
    },
    {
      id: "gallery",
      name: "Gallery",
      href: "#",
      icon: GalleryIcon,
      current: false
    },

    {
      id: "creatorTools",
      name: "Creator Tools",
      href: "#",
      icon: CreatorToolsIcon,
      current: false,
      children: [
        {
          id: "myPasses",
          name: "My Passes",
          href: "#"
        },
        {
          id: "list",
          name: "List",
          href: "#"
        },
        {
          id: "dataAnalytics",
          name: "Data analytics",
          href: "#"
        },
        {
          id: "payouts",
          name: "Payouts",
          href: "#"
        },
        {
          id: "scheduler",
          name: "Scheduler",
          href: "#"
        },
        {
          id: "vault",
          name: "Vault",
          href: "#"
        }
      ]
    },

    {
      id: "notification",
      name: "Notification",
      href: "#",
      icon: NotificationIcon,
      current: false
    },
    {
      id: "settings",
      name: "Settings",
      href: "#",
      icon: SettingsIcon,
      current: false
    }
  ]
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logout, setLogout] = useState()

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <div className="flex flex-shrink-0 items-center px-14">
                    <MomentLogo />
                  </div>
                  {/* <nav className="mt-5 space-y-1 px-2">
                      {navigation.map((item) => (
                        <a
                          key={`sidebar-mobile-${item.id}`}
                          href={item.href}
                          onClick={() => setActive(item.id)}
                          className={classNames(
                            item.id === active
                              ? "text-white"
                              : "text-gray-600 hover:text-white",
                            `group flex cursor-pointer items-center text-lg font-semibold tracking-[0.003em] text-[#A09FA6]`
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.id === active
                                ? "text-gray-500"
                                : "text-gray-400 hover:fill-white group-hover:text-gray-500",
                              "mr-4 flex-shrink-0 cursor-pointer fill-[#A09FA6] group-hover:fill-white"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </nav> */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      <header className="hidden h-screen w-full min-w-0 max-w-[88px] items-end md:sticky md:inset-y-0 md:flex md:flex-shrink-0 md:flex-col sidebar-collapse:max-w-[230px]">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 w-full flex-1 flex-col bg-[#120C14] drop-shadow-sidebar-shadow sidebar-collapse:pl-[9px] ">
          <div className="flex flex-1 flex-col justify-between overflow-y-auto pt-6 pb-4">
            <div className="">
              <div className="flex flex-shrink-0 items-center justify-center sidebar-collapse:justify-start ">
                <div className="">
                  <LogoSmall className="flex-no-shrink h-[40px] w-[40px] fill-current sidebar-collapse:hidden" />
                  <UpdatedMomentLogo className="ml-10 hidden h-[26px] w-[136px] fill-current sidebar-collapse:block " />
                </div>
              </div>
              <nav className="flex flex-col items-center gap-3 pt-[50px] sidebar-collapse:items-start sidebar-collapse:gap-[0px] ">
                {navigation.map((item) =>
                  !item.children ? (
                    <Fragment key={`sidebar-${item.id}`}>
                      <span
                        // onClick={() => setActive(item.id)}
                        className={classNames(
                          item.id === active
                            ? "border border-solid border-[#BF7AF0] bg-[#bf7af0]/10"
                            : "hover:bg-[#bf7af0]/10 hover:text-white",
                          "group flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full sidebar-collapse:hidden"
                        )}
                      >
                        <a
                          href={item.href}
                          className={classNames(
                            item.id === active
                              ? "text-white"
                              : "hover:text-white",
                            "group flex"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.id === active
                                ? "fill-white"
                                : "hover:fill-white ",
                              "flex-shrink-0 cursor-pointer fill-[#A09FA6] group-hover:fill-white "
                            )}
                            aria-hidden="true"
                          />
                        </a>
                      </span>
                      <span
                        onClick={() => setActive(item.id)}
                        key={item.id}
                        className={classNames(
                          item.id === active
                            ? "rounded-[56px] bg-[#FFFEFF]/10"
                            : "hover:text-white",
                          `group hidden cursor-pointer items-center py-[10px] px-[26px] sidebar-collapse:flex`
                        )}
                      >
                        <a
                          href={item.href}
                          className={classNames(
                            item.id === active
                              ? "text-[#ffffff]/100"
                              : "group-hover:text-white",
                            `group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-[#eeedef]/50 sidebar-collapse:flex`
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.id === active
                                ? "fill-transparent stroke-[#ffffff]/100 stroke-2"
                                : "group-hover:fill-transparent group-hover:stroke-[#ffffff]/80",
                              "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-[#ffffff]/50 stroke-2 "
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </span>
                    </Fragment>
                  ) : (
                    <Disclosure as="div" key={item.name} className="space-y-1">
                      {({ open }) => (
                        <Fragment key={`sidebar-${item.id}`}>
                          <Disclosure.Button className="hidden sidebar-collapse:block">
                            <span
                              className={classNames(
                                item.id === active
                                  ? "rounded-[56px] bg-[#FFFEFF]/10"
                                  : "hover:text-white",
                                `group hidden cursor-pointer items-center py-[10px] px-[26px]  pr-0 sidebar-collapse:flex`
                              )}
                            >
                              <a
                                href={item.href}
                                className={classNames(
                                  item.id === active
                                    ? "text-[#ffffff]/90"
                                    : "hover:text-white",
                                  `group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-[#eeedef]/50 sidebar-collapse:flex`
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    item.id === active
                                      ? "fill-transparent stroke-[#ffffff]"
                                      : "group-hover:fill-transparent group-hover:stroke-[#ffffff]/80",
                                    "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-[#ffffff]/50 stroke-2 "
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                              {open && <ChevronDown className="ml-2 h-6 w-6" />}
                            </span>
                          </Disclosure.Button>
                          {open && (
                            <Disclosure.Panel
                              static
                              className="hidden sidebar-collapse:block"
                            >
                              {item.children.map((subItem) => (
                                <a
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={() => setActive(subItem.id)}
                                  className={classNames(
                                    subItem.id === active
                                      ? "rounded-[56px] bg-[#FFFEFF]/10"
                                      : "hover:text-white",
                                    `group ml-10 hidden cursor-pointer items-center  py-[10px] px-[26px] sidebar-collapse:inline-block`
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      subItem.id === active
                                        ? "text-[#ffffff]/90"
                                        : "hover:text-white",
                                      `group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-[#eeedef]/50 sidebar-collapse:flex`
                                    )}
                                  >
                                    {subItem.name}
                                  </span>
                                </a>
                              ))}
                            </Disclosure.Panel>
                          )}
                        </Fragment>
                      )}
                    </Disclosure>
                  )
                )}
                <NewPostDialog
                  trigger={
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-[50%] bg-[#BF7AF0] sidebar-collapse:hidden">
                      <PlusSign className="h-4 w-4" />
                    </span>
                  }
                />
              </nav>
            </div>
            <div className="">
              <span
                onClick={() => setLogout(!logout)}
                className="group flex cursor-pointer items-center justify-center rounded-full sidebar-collapse:hidden"
              >
                <a
                  href={"/"}
                  className={classNames(
                    logout ? "text-white" : "text-gray-600 hover:text-white",
                    "group flex cursor-pointer items-center"
                  )}
                >
                  <LogoutIcon
                    aria-hidden="true"
                    className={classNames(
                      logout ? "fill-white" : "hover:fill-white",
                      "flex-shrink-0 cursor-pointer fill-[#A09FA6] group-hover:fill-white"
                    )}
                  />
                </a>
              </span>
            </div>
          </div>
        </div>
      </header>
      <div className="min-h-16 fixed top-0 left-0 z-30 flex w-full flex-1 items-center justify-between bg-[#252525]/50 px-2 backdrop-blur-lg md:hidden">
        <div>icon 1</div>
        <div>icon 2</div>
      </div>
    </>
  )
}
export default SideBar
