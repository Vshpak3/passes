import { Dialog, Disclosure, Transition } from "@headlessui/react"
import { useRouter } from "next/router"
import PlusSign from "public/icons/plus-sign.svg"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import CreatorToolsIcon from "public/icons/sidebar-creator-tools-icon.svg"
import HomeIcon from "public/icons/sidebar-home-icon.svg"
import LogoSmall from "public/icons/sidebar-logo-small.svg"
import MessagesIcon from "public/icons/sidebar-messages-icon.svg"
import NotificationIcon from "public/icons/sidebar-notification-icon.svg"
import PassesIcon from "public/icons/sidebar-passes-icon.svg"
import SettingsIcon from "public/icons/sidebar-settings-icon.svg"
import VaultIcon from "public/icons/sidebar-vault-icon.svg"
import { Fragment, useEffect, useState } from "react"
import { Dialog as NewPostDialog } from "src/components/organisms"
import { NewPost } from "src/components/pages/profile/main-content/new-post"

import { useUser } from "../../../hooks"
import { Button } from "../../atoms"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const navigation = [
  { id: "home", name: "Home", href: "/home", icon: HomeIcon, current: true },
  {
    id: "messages",
    name: "Messages",
    href: "/messages",
    icon: MessagesIcon,
    current: false
  },
  {
    id: "vault",
    name: "Vault",
    href: "/vault",
    icon: VaultIcon,
    current: false
  },
  {
    id: "passes",
    name: "My Passes",
    href: "/passes",
    icon: PassesIcon,
    current: false
  },

  {
    id: "tools",
    name: "Creator Tools",
    icon: CreatorToolsIcon,
    current: false,
    children: [
      {
        id: "choice",
        name: "Manage Passes",
        href: "/tools/choice"
      },
      {
        id: "[collection]",
        name: "Pass Collection",
        href: "/tools/passes/collection"
      },
      {
        id: "purchase",
        name: "Purchase Pass",
        href: "/tools/purchase"
      },
      {
        id: "list",
        name: "List",
        href: "/tools/list"
      },
      {
        id: "analytics",
        name: "Analytics",
        href: "/tools/analytics"
      },
      {
        id: "earnings",
        name: "Earnings",
        href: "/tools/earnings"
      },
      {
        id: "payouts",
        name: "Payouts",
        href: "/tools/payouts"
      },
      {
        id: "scheduler",
        name: "Scheduler",
        href: "/tools/scheduler"
      }
    ]
  },

  {
    id: "notification",
    name: "Notification",
    href: "/notification",
    icon: NotificationIcon,
    current: false
  },
  {
    id: "settings",
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    current: false
  }
]

const collapsedNavigation = [
  {
    id: "choice",
    name: "Manage Passes",
    href: "/tools/choice"
  },
  {
    id: "[collection]",
    name: "Pass Collection",
    href: "/tools/passes/collection"
  },
  {
    id: "purchase",
    name: "Purchase Pass",
    href: "/tools/purchase"
  },
  {
    id: "list",
    name: "List",
    href: "/tools/list"
  },
  {
    id: "analytics",
    name: "Analytics",
    href: "/tools/analytics"
  },
  {
    id: "earnings",
    name: "Earnings",
    href: "/tools/earnings"
  },
  {
    id: "payouts",
    name: "Payouts",
    href: "/tools/payouts"
  },
  {
    id: "scheduler",
    name: "Scheduler",
    href: "/tools/scheduler"
  }
]
const SideBar = () => {
  const router = useRouter()

  const [hasMounted, setHasMounted] = useState(false)
  const [active, setActive] = useState(router.asPath.split("/").pop())
  const { user } = useUser()
  // TODO: replace with owns a profile endpoint
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // const [sidebarOpen, setSidebarOpen] = useState(false)
  // TODO: sidebar open will be used for mobile sidebar
  const [collapsedAdditionalSidebarOpen, setCollapsedAdditionalSidebarOpen] =
    useState(false)

  const openCollapsedAdditionalSidebar = (tab) => {
    setActive(tab)
    setCollapsedAdditionalSidebarOpen(true)
  }

  const closeCollapsedAdditionalSidebar = () => {
    setActive("")
    setCollapsedAdditionalSidebarOpen(false)
  }

  if (!hasMounted) {
    return null
  } else
    return (
      <>
        {/* Static sidebar for desktop */}
        <header className="hidden h-screen w-full min-w-0 max-w-[88px] items-end md:sticky md:inset-y-0 md:flex md:flex-shrink-0 md:flex-col sidebar-collapse:max-w-[230px]">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 w-full flex-1 flex-col bg-[#120C14]  sidebar-collapse:pl-[9px] ">
            <div className="flex flex-1 flex-col justify-between overflow-y-auto pt-6 pb-4">
              <div className="">
                <div className="flex flex-shrink-0 items-center justify-center sidebar-collapse:justify-start ">
                  <div className="">
                    <LogoSmall className="flex-no-shrink h-[40px] w-[40px] fill-current sidebar-collapse:hidden" />
                    {/* <UpdatedMomentLogo className="ml-10 hidden h-[26px] w-[136px] fill-current sidebar-collapse:block " /> */}
                    <h1 className="ml-10 hidden fill-current font-serif text-[40px] font-medium italic tracking-tight sidebar-collapse:block ">
                      {/* TODO: replace with new logo passes */}
                      Passes
                    </h1>
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
                            as={item.href}
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
                                  ? "fill-transparent stroke-white stroke-2"
                                  : "stroke-[#ffffff]/30 group-hover:stroke-[#ffffff]/80",
                                "flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2 "
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
                              : "group-hover:stroke-[#ffffff]/8 group-hover:text-white",
                            `group hidden cursor-pointer items-center py-[10px] px-[26px] sidebar-collapse:flex`
                          )}
                        >
                          <a
                            href={item.href}
                            as={item.href}
                            className={classNames(
                              item.id === active
                                ? "text-white"
                                : "text-[#eeedef]/50 group-hover:text-white",
                              `group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex`
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.id === active
                                  ? "fill-transparent stroke-white stroke-2"
                                  : "stroke-[#ffffff]/30 group-hover:stroke-[#ffffff]/80",
                                "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2 "
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </span>
                      </Fragment>
                    ) : (
                      <Disclosure
                        as={Fragment}
                        key={item.name}
                        defaultOpen={router.asPath.startsWith(`/${item.id}/`)}
                      >
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
                                  as={item.href}
                                  className={classNames(
                                    item.id === active
                                      ? "text-white"
                                      : "text-[#eeedef]/50 group-hover:text-white",
                                    `group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex`
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.id === active
                                        ? "fill-transparent stroke-white stroke-2"
                                        : "stroke-[#ffffff]/30 group-hover:stroke-[#ffffff]/80",
                                      "mr-4 flex-shrink-0 cursor-pointer fill-transparent stroke-white stroke-2 "
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>

                                <ChevronDown
                                  className={`ml-2 h-6 w-6 ${
                                    open ? "rotate-180" : ""
                                  }`}
                                />
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
                                    as={subItem.href}
                                    onClick={() => setActive(subItem.id)}
                                    className={classNames(
                                      subItem.id === active
                                        ? "rounded-[56px] bg-[#FFFEFF]/10"
                                        : "group-hover:stroke-[#ffffff]/8 group-hover:text-white",
                                      `group ml-10 hidden cursor-pointer items-center py-[10px] px-[26px] sidebar-collapse:inline-block`
                                    )}
                                  >
                                    <span
                                      className={classNames(
                                        subItem.id === active
                                          ? "text-white"
                                          : "text-[#eeedef]/50 group-hover:text-white",
                                        `group hidden cursor-pointer items-center text-base font-semibold tracking-[0.003em] text-white sidebar-collapse:flex`
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
                  <Disclosure>
                    <Disclosure.Button>
                      <span
                        onClick={() => openCollapsedAdditionalSidebar("tools")}
                        className={classNames(
                          active === "tools"
                            ? "border border-solid border-[#BF7AF0] bg-[#bf7af0]/10"
                            : "hover:bg-[#bf7af0]/10 hover:text-white",
                          "group flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full sidebar-collapse:hidden"
                        )}
                      >
                        <CreatorToolsIcon
                          className={classNames(
                            active === "tools"
                              ? "fill-transparent stroke-white stroke-2"
                              : "stroke-[#ffffff]/30 group-hover:stroke-[#ffffff]/80 ",
                            "flex-shrink-0 cursor-pointer stroke-white stroke-2  "
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </Disclosure.Button>
                  </Disclosure>

                  {user?.isCreator && (
                    <NewPostDialog
                      triggerClassName="flex items-center justify-center self-center sidebar-collapse:pt-8"
                      className="h-screen w-screen transform overflow-hidden transition-all md:max-h-[580px] md:max-w-[580px] lg:max-w-[680px]"
                      trigger={
                        <>
                          <span className="flex h-12 w-12 items-center justify-center rounded-[50%] bg-[#BF7AF0] sidebar-collapse:hidden">
                            <PlusSign className="h-4 w-4 " />
                          </span>
                          <div className="hidden sidebar-collapse:flex">
                            <Button
                              className="mt-4 w-full max-w-sm  border-none !px-6 !py-5 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white  dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
                              variant="pink"
                            >
                              Create New Post
                            </Button>
                          </div>
                        </>
                      }
                    >
                      <NewPost />
                    </NewPostDialog>
                  )}
                  <div className="flex items-center justify-center sidebar-collapse:hidden">
                    {!user?.isCreator && (
                      <span className="flex h-12 w-12 items-center justify-center rounded-[50%] bg-[#BF7AF0] sidebar-collapse:hidden">
                        <PlusSign className="h-4 w-4 " />
                      </span>
                    )}
                  </div>
                  <div className="hidden sidebar-collapse:flex sidebar-collapse:items-center sidebar-collapse:justify-center sidebar-collapse:self-center">
                    {!user?.isCreator && (
                      <Button
                        className="mt-4 w-full max-w-sm  border-none !px-6 !py-5 text-black transition-colors hover:bg-mauve-mauve12 hover:text-white  dark:text-mauveDark-mauve12 dark:hover:bg-mauveDark-mauve12 dark:hover:text-black"
                        variant="pink"
                      >
                        Become a Creator
                      </Button>
                    )}
                  </div>
                </nav>
              </div>
              {/* TODO: logout will be only on the profile top right options- temporary */}
              {/* <div className="">
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
              </div> */}
            </div>
          </div>
        </header>

        <div className="min-h-16 fixed top-0 left-0 z-30 flex w-full flex-1 items-center justify-between bg-[#252525]/50 px-2 backdrop-blur-lg md:hidden">
          <div>icon 1</div>
          <div>icon 2</div>
        </div>
        <Transition.Root show={collapsedAdditionalSidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40"
            onClose={closeCollapsedAdditionalSidebar}
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
              <div className="fixed inset-0 bg-transparent " />
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
                <Dialog.Panel className="relative mt-[10px] ml-[10px] flex max-h-[82vh] w-full max-w-[180px] flex-1 flex-col rounded-lg bg-[#120C14] drop-shadow-sidebar-shadow">
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="flex flex-col items-start gap-3 p-3 ">
                      {collapsedNavigation.map((item) => (
                        <Fragment key={`sidebar-${item.id}`}>
                          <span
                            onClick={() => setActive(item.id)}
                            key={item.id}
                            className={classNames(
                              item.id === active
                                ? "border border-solid border-[#BF7AF0] bg-[#bf7af0]/10"
                                : "hover:bg-[#bf7af0]/10 hover:text-white",
                              "group flex cursor-pointer items-start justify-center rounded-full px-4 py-2 "
                            )}
                          >
                            <a
                              href={item.href}
                              as={item.href}
                              className={classNames(
                                item.id === active
                                  ? "text-white"
                                  : "text-[#eeedef]/50 group-hover:text-white",
                                `group flex cursor-pointer items-start text-base font-semibold tracking-[0.003em] text-white `
                              )}
                            >
                              {item.name}
                            </a>
                          </span>
                        </Fragment>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </>
    )
}
export default SideBar
