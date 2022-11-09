import { FC, PropsWithChildren } from "react"

interface PaymenetModalFooterProps {
  onClose: () => void
}

export const PaymenetModalFooter: FC<
  PropsWithChildren<PaymenetModalFooterProps>
> = ({ onClose, children }) => {
  return (
    <div className="flex w-full items-center justify-end">
      <div
        className="mr-8 cursor-pointer font-bold text-passes-primary-color"
        onClick={onClose}
      >
        Cancel
      </div>
      {children}
    </div>
  )
}
