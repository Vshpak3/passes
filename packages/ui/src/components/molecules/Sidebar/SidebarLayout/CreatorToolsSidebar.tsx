import { Dialog, Transition } from "@headlessui/react"
import classNames from "classnames"
import React, { Fragment } from "react"

const CreatorToolsSidebar = ({
  active,
  collapsedAdditionalSidebarOpen,
  closeCollapsedAdditionalSidebar,
  collapsedNavigation,
  setActive
}: any) => {
  return (
    <>
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
                    {collapsedNavigation.map((item: any) => (
                      <Fragment key={`sidebar-${item.id}`}>
                        <span
                          onClick={() => setActive(item.id)}
                          key={item.id}
                          className={classNames(
                            item.id === active
                              ? "border border-solid border-passes-secondary-color bg-passes-secondary-color/10"
                              : "hover:bg-passes-secondary-color/10 hover:text-white",
                            "group flex cursor-pointer items-start justify-center rounded-full px-4 py-2 "
                          )}
                        >
                          <a
                            href={item.href}
                            className={classNames(
                              item.id === active
                                ? "text-white"
                                : "text-[#eeedef]/50 group-hover:text-white",
                              "group flex cursor-pointer items-start text-base font-semibold tracking-[0.003em] text-white "
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

export default CreatorToolsSidebar
