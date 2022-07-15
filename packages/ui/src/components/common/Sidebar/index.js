import { Dialog, Transition } from "@headlessui/react"
import HomeIcon from "public/icons/sidebar-home-icon.svg"
import LogoSmall from "public/icons/sidebar-logo-small.svg"
import LogoutIcon from "public/icons/sidebar-logout-icon.svg"
import MessagesIcon from "public/icons/sidebar-messages-icon.svg"
import PassesIcon from "public/icons/sidebar-passes-icon.svg"
import PaymentsIcon from "public/icons/sidebar-payments-icon.svg"
import SettingsIcon from "public/icons/sidebar-settings-icon.svg"
import SubscriptionsIcon from "public/icons/sidebar-subscriptions-icon.svg"
import MomentLogo from "public/moment-logo.svg"
import UpdatedMomentLogo from "public/moment-logo-updated.svg"
import { Fragment, useState } from "react"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}
const SideBar = () => {
  const [active, setActive] = useState(0)
  const navigation = [
    { id: 1, name: "Home", href: "#", icon: HomeIcon, current: true },
    { id: 2, name: "Messages", href: "#", icon: MessagesIcon, current: false },
    { id: 3, name: "Passes", href: "#", icon: PassesIcon, current: false },
    { id: 4, name: "Payments", href: "#", icon: PaymentsIcon, current: false },
    {
      id: 5,
      name: "Subscriptions",
      href: "#",
      icon: SubscriptionsIcon,
      current: false
    },
    { id: 6, name: "Settings", href: "#", icon: SettingsIcon, current: false }
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
                  <nav className="mt-5 space-y-1 px-2">
                    {navigation.map((item, index) => (
                      <a
                        key={index}
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
                  </nav>
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
      <header
        className={`hidden h-screen w-full min-w-0 max-w-[88px] items-end md:sticky md:inset-y-0 md:flex md:flex-shrink-0 md:flex-col sidebar-collapse:max-w-[230px]`}
      >
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 w-full flex-1 flex-col bg-[#120C14] drop-shadow-sidebar-shadow sidebar-collapse:pl-8 ">
          <div className="flex flex-1 flex-col justify-between overflow-y-auto pt-6 pb-4">
            <div className="">
              <div className="flex flex-shrink-0 items-center justify-center sidebar-collapse:justify-start ">
                <div className="">
                  <LogoSmall className="flex-no-shrink h-[40px] w-[40px] fill-current sidebar-collapse:hidden" />
                  <UpdatedMomentLogo className="hidden h-[26px] w-[136px] fill-current sidebar-collapse:block " />
                </div>
              </div>
              <nav className="flex flex-col items-center space-y-3 pt-5 sidebar-collapse:items-start ">
                {navigation.map((item, index) => (
                  <>
                    <span
                      key={index}
                      onClick={() => setActive(item.id)}
                      className={classNames(
                        item.id === active
                          ? "border border-solid border-[#BF7AF0] bg-[#bf7af0]/10"
                          : "hover:bg-[#bf7af0]/10 hover:text-white",
                        "group flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full sidebar-collapse:hidden"
                      )}
                    >
                      <a
                        key={item.name}
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
                            "flex-shrink-0 cursor-pointer fill-[#A09FA6] group-hover:fill-white"
                          )}
                          aria-hidden="true"
                        />
                      </a>
                    </span>
                    <a
                      key={index}
                      href={item.href}
                      onClick={() => setActive(item.id)}
                      className={classNames(
                        item.id === active
                          ? "text-gray-50"
                          : "hover:text-white",
                        `group hidden cursor-pointer items-center text-lg font-semibold tracking-[0.003em] text-[#A09FA6] sidebar-collapse:flex`
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.id === active
                            ? "fill-white"
                            : "hover:fill-white",
                          "mr-4 flex-shrink-0 cursor-pointer fill-[#A09FA6] group-hover:fill-white"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </>
                ))}
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
