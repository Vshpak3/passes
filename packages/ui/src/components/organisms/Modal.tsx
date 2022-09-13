import Image from "next/image"
import React, { Dispatch, SetStateAction, useEffect } from "react"
import ReactModal from "react-modal"

interface IModal {
  isOpen: any
  setOpen: Dispatch<SetStateAction<any>>
  children: React.ReactNode
}

const Modal = ({ isOpen = null, setOpen, children }: IModal) => {
  useEffect(() => {
    ReactModal.setAppElement("body")
  }, [])
  return (
    <ReactModal
      isOpen={!!isOpen}
      onRequestClose={() => setOpen(null)}
      style={{
        content: {
          background: "transparent",
          border: "0px",
          alignItems: "center",
          justifyItems: "center",
          display: "flex"
        },
        overlay: {
          background: "rgba(0, 0, 0, 0.5)"
        }
      }}
    >
      <div
        id="popup-modal"
        className={
          "m-auto w-[500px] rounded bg-[#1b141d] p-4 md:border-[#ffffff]/10"
        }
      >
        <div className="text-right">
          <button
            type="button"
            className="top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-[#ffff]/90 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="popup-modal"
            onClick={() => setOpen(null)}
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
        <div className="p-3 pt-0">{children}</div>
      </div>
    </ReactModal>
  )
}

export default Modal
