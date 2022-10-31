import { Dialog, Transition } from "@headlessui/react"
import { FC, Fragment, PropsWithChildren } from "react"

import { SidebarMobileHeader } from "./SidebarMobileHeader"

interface SidebarMobileContainerProps {
  mobileSidebarOpen: boolean
  toggleSidebar: () => void
}

export const SidebarMobileContainer: FC<
  PropsWithChildren<SidebarMobileContainerProps>
> = ({ children, mobileSidebarOpen, toggleSidebar }) => {
  return (
    <Transition.Root show={mobileSidebarOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={toggleSidebar}>
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
            <Dialog.Panel className="relative flex max-h-[100vh] w-full max-w-[256px] flex-1 flex-col bg-passes-black">
              <div className="h-0 flex-1 overflow-y-auto">
                <SidebarMobileHeader toggleSidebar={toggleSidebar} />
                <div className="">
                  <nav className="flex flex-col items-start gap-3">
                    {children}
                  </nav>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
