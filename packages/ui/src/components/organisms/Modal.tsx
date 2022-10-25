import classNames from "classnames"
import Image from "next/image"
import React, {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useRef
} from "react"
import ReactModal from "react-modal"

import { useOnClickOutside } from "src/hooks/useOnClickOutside"

export interface ModalProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  closable?: boolean
  shouldCloseOnClickOutside?: boolean
  modalContainerClassname?: string
  childrenClassname?: string
  isNewPost?: boolean
  isCloseOutside?: boolean
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  isOpen = false,
  setOpen,
  children,
  closable = true,
  shouldCloseOnClickOutside = false,
  modalContainerClassname,
  childrenClassname,
  isNewPost,
  isCloseOutside
}) => {
  const modalContentRef = useRef(null)
  useOnClickOutside(modalContentRef, () => {
    if (isCloseOutside) {
      setOpen(false)
    }
  })

  useEffect(() => {
    ReactModal.setAppElement("body")
  }, [])
  return (
    <ReactModal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={shouldCloseOnClickOutside}
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
          borderRadius: "20px",
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
        className={classNames(
          "m-auto w-full rounded p-4 md:w-auto md:min-w-[500px] md:border-[#ffffff]/10",
          modalContainerClassname,
          isNewPost
            ? "bg-transparent md:min-w-fit md:border-transparent"
            : "bg-[#1b141d]"
        )}
      >
        {closable && (
          <div className="relative text-right">
            <button
              type="button"
              className={classNames(
                "top-3 right-2.5 ml-auto inline-flex items-center rounded-[15px] bg-transparent p-1.5 text-sm text-[#ffff]/90 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
                isNewPost && "absolute right-[20px] top-[20px] z-[6]"
              )}
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
        <div
          ref={modalContentRef}
          className={classNames("p-3 pt-0", childrenClassname)}
        >
          {children}
        </div>
      </div>
    </ReactModal>
  )
}
