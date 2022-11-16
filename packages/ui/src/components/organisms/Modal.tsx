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
  bare?: boolean
  isCloseOutside?: boolean
  mobileFixed?: boolean
  closableOnScreen?: boolean
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  isOpen = false,
  setOpen,
  children,
  closable = true,
  shouldCloseOnClickOutside = false,
  modalContainerClassname,
  childrenClassname,
  bare,
  isCloseOutside,
  mobileFixed = false,
  closableOnScreen = false
}) => {
  const modalContentRef = useRef(null)
  useOnClickOutside(
    modalContentRef,
    (e) => {
      e.stopImmediatePropagation()
      e.stopPropagation()
      if (isCloseOutside) {
        setOpen(false)
      }
    },
    true
  )

  useEffect(() => {
    ReactModal.setAppElement("body")

    document.body.style.overflow = isOpen ? "hidden" : "auto"

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => (isCloseOutside ? setOpen(false) : null)}
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
          zIndex: 3000
        }
      }}
    >
      <div
        className={classNames(
          "m-auto rounded p-4 md:w-auto md:min-w-[500px] md:border-[#ffffff]/10",
          modalContainerClassname,
          bare
            ? "bg-transparent md:min-w-fit md:border-transparent"
            : "bg-[#12070E]",
          !mobileFixed && "w-full"
        )}
        id="popup-modal"
      >
        {closable && (
          <div
            className={classNames(
              !closableOnScreen && "relative",
              "text-right"
            )}
          >
            <button
              className={classNames(
                "top-3 right-2.5 ml-auto inline-flex items-center rounded-[15px] bg-transparent p-1.5 text-sm text-[#ffff]/90 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white",
                bare && "absolute right-[20px] top-[20px] z-[6]"
              )}
              data-modal-toggle="popup-modal"
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              onTouchEnd={(e) => {
                e.stopPropagation()
                setOpen(false)
              }}
              type="button"
            >
              <Image
                alt="Close button"
                height={25}
                src="/icons/exit-icon.svg"
                width={25}
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
