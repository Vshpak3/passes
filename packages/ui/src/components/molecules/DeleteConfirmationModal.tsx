import Image from "next/image"
import React, { Dispatch, FC, SetStateAction, useEffect, useRef } from "react"
import ReactModal from "react-modal"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

export interface DeleteConfirmationModalProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onCancel(): void
  onDelete(): void
}

export const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
  isOpen = false,
  setOpen,
  onCancel,
  onDelete
}) => {
  const modalContentRef = useRef(null)

  useOnClickOutside(modalContentRef, () => {
    setOpen(false)
  })

  useEffect(() => {
    ReactModal.setAppElement("body")
  }, [])

  return (
    <ReactModal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={true}
      onRequestClose={() => setOpen(false)}
      style={{
        content: {
          display: "flex",
          flexGrow: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "fit-content",
          height: "fit-content",
          borderRadius: "6px",
          // Overrides
          padding: 0,
          border: 0,
          background: "transparent"
        },
        overlay: {
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 11
        }
      }}
    >
      <div
        id="popup-modal"
        className="m-auto w-full w-[298px] bg-[#100C11] py-3 px-6 md:w-auto md:min-w-[500px] md:border-[#ffffff]/10"
      >
        <div className="relative text-right">
          <button
            type="button"
            className="top-3 right-2.5 ml-auto inline-flex items-center rounded-[15px] bg-transparent p-1.5 text-sm text-[#ffff]/90 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="popup-modal"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/icons/exit-icon.svg"
              alt="Close button"
              width={20}
              height={20}
            />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div ref={modalContentRef} className="p-3 pt-0">
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
                className="text-4 text-4 rounded-full bg-[#C943A82B] py-[6px] px-4 font-bold text-[#C943A8]"
                onClick={onDelete}
              >
                Delete
              </button>
              <button
                className="text-4 text-4 rounded-full bg-[#9C9C9C2B] py-[6px] px-4 font-bold text-[#EDECED]"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  )
}
