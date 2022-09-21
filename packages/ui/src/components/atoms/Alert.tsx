import cn from "classnames"
import AlertCircleIcon from "public/icons/alert-circle.svg"
import React, { useRef, useState } from "react"

import { useOnClickOutside } from "../../hooks"

interface IAlertProps {
  className?: string
  tooltipClassName?: string
  messageClassName?: string
  message: string
}

const Alert: React.FC<IAlertProps> = ({
  className,
  tooltipClassName,
  messageClassName,
  message
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const alertEl = useRef(null)

  useOnClickOutside(alertEl, () => {
    setShowTooltip(false)
  })

  return (
    <div ref={alertEl} className={cn("absolute", className)}>
      {showTooltip && (
        <div
          className={cn(
            "absolute top-[-76px] left-1/2 w-[126px] -translate-x-1/2 rounded-lg bg-[#2A242B] px-3 py-2 text-center text-xs font-medium text-white",
            messageClassName
          )}
        >
          <span>{message}</span>

          <span
            className={cn(
              "absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[1px] bg-[#2A242B]",
              tooltipClassName
            )}
          />
        </div>
      )}
      <button
        onClick={() => setShowTooltip((prevShow) => !prevShow)}
        className="flex h-4 w-4 items-center justify-center"
        type="button"
      >
        <AlertCircleIcon />
      </button>
    </div>
  )
}

export default Alert
