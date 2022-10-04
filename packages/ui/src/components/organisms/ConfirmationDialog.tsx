import React, { FC } from "react"
import { Dialog } from "src/components/organisms"

interface IConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  desc?: string
  confirmString?: string
  cancelString?: string
}

const ConfirmationDialog: FC<IConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  desc,
  confirmString = "Confirm",
  cancelString = "Cancel"
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="relative rounded-md bg-[#100C11] px-6 pt-[30px] pb-4">
        <button className="absolute top-3 right-6" onClick={onClose}>
          <span>X</span>
        </button>
        <div className="border-b border-passes-dark-200 pb-2.5">
          <h5 className="text-base font-bold leading-4">{title}</h5>
          {desc && (
            <p className="mt-1.5 text-xs font-medium leading-6 text-passes-gray-200">
              {desc}
            </p>
          )}
        </div>
        <div className="mt-2.5 flex justify-between space-x-[33px]">
          <button
            className="text-label rounded-full bg-passes-pink-100/[0.17] px-4 py-1.5 text-passes-pink-100"
            onClick={() => {
              onClose()
              onConfirm()
            }}
          >
            {confirmString}
          </button>
          <button
            onClick={onClose}
            className="text-label rounded-full bg-[#9C9C9C]/[0.17] px-4 py-1.5 text-white"
          >
            {cancelString}
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmationDialog
