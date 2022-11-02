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
      onRequestClose={() => setOpen(false)}
      shouldCloseOnOverlayClick={shouldCloseOnClickOutside}
      style={{
        content: {
          display: "flex",
          flexGrow: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
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
        className={classNames(
          "m-auto w-full rounded p-4 md:w-auto md:min-w-[500px] md:border-[#ffffff]/10",
          modalContainerClassname,
          isNewPost
            ? "bg-transparent md:min-w-fit md:border-transparent"
            : "bg-[#1b141d]"
        )}
        id="popup-modal"
      >
        {closable && (
          <div className="relative text-right">
            <button
              className={classNames(
                "top-3 right-2.5 ml-auto inline-flex items-center rounded-[15px] bg-transparent p-1.5 text-sm text-[#ffff]/90 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
                isNewPost && "absolute right-[20px] top-[20px] z-[6]"
              )}
              data-modal-toggle="popup-modal"
              onClick={() => setOpen(false)}
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
        )}
        <div
          className={classNames("p-3 pt-0", childrenClassname)}
          ref={modalContentRef}
        >
          {children}
        </div>
      </div>
    </ReactModal>
  )
}
