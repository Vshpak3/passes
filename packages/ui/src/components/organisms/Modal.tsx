import classNames from "classnames"
import Image from "next/image"
import React, {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useEffect
} from "react"
import ReactModal from "react-modal"

interface ModalProps {
  isOpen: any
  setOpen: Dispatch<SetStateAction<any>>
  closable?: boolean
  modalContainerClassname?: string
}

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  isOpen = false,
  setOpen,
  children,
  closable = true,
  modalContainerClassname
}) => {
  useEffect(() => {
    ReactModal.setAppElement("body")
  }, [])
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setOpen(false)}
      shouldCloseOnOverlayClick={true}
      style={{
        content: {
          background: "transparent",
          border: "0px",
          alignItems: "center",
          justifyItems: "center",
          display: "flex"
        },
        overlay: {
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 11
        }
      }}
    >
      <div
        id="popup-modal"
        className={classNames(
          "m-auto w-full rounded bg-[#1b141d] p-4 md:w-auto md:min-w-[500px] md:border-[#ffffff]/10",
          modalContainerClassname
        )}
      >
        {closable && (
          <div className="text-right">
            <button
              type="button"
              className="top-3 right-2.5 ml-auto inline-flex items-center rounded-[20px] bg-transparent p-1.5 text-sm text-[#ffff]/90 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
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
        )}
        <div className="p-3 pt-0">{children}</div>
      </div>
    </ReactModal>
  )
}

export default Modal
