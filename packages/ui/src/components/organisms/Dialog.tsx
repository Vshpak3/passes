import { Dialog as HeadlessDialog, Transition } from "@headlessui/react"
import classNames from "classnames"
import { FC, Fragment, PropsWithChildren, useEffect, useState } from "react"

import { formatText } from "src/helpers/formatters"

type DialogProps = {
  open?: boolean
  onClose?: () => void
  title?: JSX.Element | string
  footer?: JSX.Element | string
  className?: string
  media?: boolean
  transition?: boolean
  innerScroll?: boolean
}

export const Dialog: FC<PropsWithChildren<DialogProps>> = ({
  open = false,
  onClose = () => null,
  title,
  footer,
  className,
  media,
  children,
  transition = true,
  innerScroll = false
}) => {
  const [isOpen, setIsOpen] = useState(open)

  const handleOnClose = () => {
    setIsOpen(false)
    onClose()
  }

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const transitionProps = transition
    ? {
        enterFrom: "opacity-0 scale-95",
        enterTo: "opacity-100 scale-100"
      }
    : {}

  return (
    <Transition appear as={Fragment} show={isOpen}>
      <HeadlessDialog
        as="div"
        className="relative z-10"
        onClose={handleOnClose}
        open={isOpen}
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
              media ? "bg-black" : "bg-black/40",
              "bg-opacity-15 fixed inset-0 bg-transparent"
            )}
          />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex min-h-full items-center justify-center bg-inherit md:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
              {...transitionProps}
            >
              <HeadlessDialog.Panel className={className}>
                <div className="relative flex h-full w-full flex-col justify-between">
                  {!!title && (
                    <HeadlessDialog.Title className="z-20">
                      {typeof title === "string" ? formatText(title) : title}
                    </HeadlessDialog.Title>
                  )}
                  <div
                    className={classNames(
                      "z-10 h-full w-full",
                      innerScroll ? "overflow-y-hidden" : "overflow-y-scroll"
                    )}
                  >
                    {children}
                  </div>
                  {!!footer && (
                    <div className="relative z-20 w-full self-end">
                      {typeof footer === "string" ? formatText(footer) : footer}
                    </div>
                  )}
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  )
}
