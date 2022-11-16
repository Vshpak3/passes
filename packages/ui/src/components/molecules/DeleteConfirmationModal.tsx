import Image from "next/image"
import { FC, useRef } from "react"

import { Dialog } from "src/components/organisms/Dialog"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose(): void
  onDelete(): void
  text?: string
}

export const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  text = "Delete"
}) => {
  const modalContentRef = useRef(null)

  const handleDelete = async () => {
    await onDelete()
    onClose()
  }

  useOnClickOutside(modalContentRef, () => {
    onClose()
  })

  return (
    <Dialog
      className="border border-white/10 bg-passes-black px-6 py-5 md:rounded-lg"
      onClose={onClose}
      open={isOpen}
    >
      <div
        className="m-auto w-[298px] py-3 px-6 md:w-auto md:min-w-[500px] md:border-white/10"
        id="popup-modal"
      >
        <div className="relative text-right">
          <button
            className="top-3 right-2.5 ml-auto inline-flex items-center rounded-[15px] bg-transparent p-1.5 text-sm text-white/90 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="popup-modal"
            onClick={onClose}
            type="button"
          >
            <Image
              alt="Close button"
              height={20}
              src="/icons/exit-icon.svg"
              width={20}
            />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-3 pt-0" ref={modalContentRef}>
          <div className="flex flex-col items-center">
            <h2 className="mb-[6px] text-[16px] font-bold text-white">
              Are You Sure?
            </h2>
            <p className="text-[12px] font-[500] text-[#767676]">
              This process can not be undone
            </p>
            <div className="my-3 h-[0.5px] w-full bg-[#2C282D]" />
            <div className="flex w-full flex-row justify-between">
              <button
                className="rounded-full bg-[#C943A82B] py-[6px] px-4 font-bold text-[#C943A8]"
                onClick={handleDelete}
              >
                {text}
              </button>
              <button
                className="rounded-full bg-[#9C9C9C2B] py-[6px] px-4 font-bold text-[#EDECED]"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
