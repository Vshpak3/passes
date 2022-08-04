import { Dialog as HeadlessDialog, Transition } from "@headlessui/react"
import { Fragment, ReactNode, useState } from "react"

import { classNames } from "../../helpers/classNames"

type DialogProps = {
  triggerClassName?: string
  trigger?: JSX.Element
  open?: boolean
  onClose?: (value: boolean) => void
  title?: JSX.Element | string
  footer?: JSX.Element | string
  children?: ReactNode
  className?: string
  media?: boolean
}

export const Dialog = ({
  triggerClassName = "",
  trigger,
  open = false,
  onClose = () => null,
  title,
  footer,
  className,
  media,
  children
}: DialogProps) => {
  const [isOpen, setIsOpen] = useState(open)
  return (
    <>
      <button className={triggerClassName} onClick={() => setIsOpen(true)}>
        {trigger}
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <HeadlessDialog
          as="div"
          className="relative z-10"
          open={isOpen}
          onClose={onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={classNames(
                media ? "bg-black" : " backdrop-blur-md",
                "bg-opacity-15 fixed inset-0 bg-transparent"
              )}
            />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center text-center md:px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <HeadlessDialog.Panel className={className}>
                  <div className="relative flex h-full flex-col justify-between">
                    {title && (
                      <HeadlessDialog.Title>{title}</HeadlessDialog.Title>
                    )}
                    <div className="h-full overflow-y-auto">{children}</div>
                    {footer && <div className="self-end">{footer}</div>}
                  </div>
                </HeadlessDialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </HeadlessDialog>
      </Transition>
    </>
  )
}
