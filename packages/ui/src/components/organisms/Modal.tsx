import React, { Dispatch, SetStateAction } from "react"

interface IModal {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  children: React.ReactNode
}

const Modal = ({ isOpen = false, setOpen, children }: IModal) => {
  return (
    <div
      id="popup-modal"
      tabIndex={parseInt("-1")}
      className={`h-modal fixed top-0 right-0 left-0 z-50 ${
        isOpen ? "block" : "hidden"
      } h-full translate-y-[10%] overflow-y-auto overflow-x-hidden`}
    >
      <div className="relative m-auto h-full w-full max-w-[75%] p-4">
        <div className="relative rounded-lg bg-gradient-to-r from-[#598BF4]/90 to-[#B53BEC]/90 shadow dark:bg-gray-700">
          <div className="text-right">
            <button
              type="button"
              className="top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-[#ffff]/90 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              data-modal-toggle="popup-modal"
              onClick={() => setOpen(!setOpen)}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-6">
            {/* Content */}
            {children}
            {/* <button
              data-modal-toggle="popup-modal"
              type="button"
              className="mr-2 inline-flex items-center rounded-lg bg-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            >
              Confirm
            </button>
            <button
              data-modal-toggle="popup-modal"
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600"
              onClick={() => setOpen(!setOpen)}
            >
              Cancel
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
