import { Dialog as HeadlessDialog, Transition } from "@headlessui/react"
import { Fragment, ReactNode, useState } from "react"
import { classNames } from "src/helpers"

type DialogProps = {
  triggerClassName?: string
  trigger?: JSX.Element
  open?: boolean
  onClose?: () => void
  title?: JSX.Element | string
  footer?: JSX.Element | string
  children?: ReactNode
  className?: string
  media?: boolean
}

const Dialog = ({
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

  const handleOnClose = () => {
    setIsOpen(false)
    onClose()
  }

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
          onClose={handleOnClose}
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
                media ? "bg-black" : " bg-black/40",
                "bg-opacity-15 fixed inset-0 bg-transparent"
              )}
            />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center bg-inherit text-center md:px-4">
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
                  <div className="relative flex h-full w-full flex-col justify-between">
                    {title && (
                      <HeadlessDialog.Title className="z-20">
                        {title}
                      </HeadlessDialog.Title>
                    )}
                    <div className="z-10 h-full w-full overflow-y-auto">
                      {children}
                    </div>
                    {footer && (
                      <div className="relative z-20 w-full self-end">
                        {footer}
                      </div>
                    )}
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

export default Dialog
