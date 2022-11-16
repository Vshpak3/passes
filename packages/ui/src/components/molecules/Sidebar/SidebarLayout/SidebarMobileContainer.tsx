import { Dialog, Transition } from "@headlessui/react"
import { FC, Fragment, PropsWithChildren } from "react"

interface SidebarMobileContainerProps {
  mobileSidebarOpen: boolean
  toggleSidebar: () => void
}

export const SidebarMobileContainer: FC<
  PropsWithChildren<SidebarMobileContainerProps>
> = ({ children, mobileSidebarOpen, toggleSidebar }) => {
  return (
    <div>
      <Transition.Root as={Fragment} show={mobileSidebarOpen}>
        <Dialog as="div" className="relative z-40" onClose={toggleSidebar}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-70"
            leave="ease-out"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
          >
            <div className="fixed inset-0 bg-gradient-to-r from-passes-primary-color/10 to-black opacity-75" />
          </Transition.Child>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-100"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="ease-out"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="translate-x-full opacity-0"
            >
              <Dialog.Panel className="relative flex w-full max-w-[220px] flex-1 flex-col overflow-y-auto border-r-[1px] border-passes-gray bg-passes-black scrollbar-hide">
                <div className="h-0 flex-1">
                  <nav className="flex flex-col items-start gap-3">
                    {children}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div aria-hidden="true" className="w-14 shrink-0">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}
