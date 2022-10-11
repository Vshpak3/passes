import classNames from "classnames"
import React, { FC, SVGProps, useState } from "react"

interface IconTooltipProps {
  Icon: FC<SVGProps<SVGSVGElement>>
  position: "top" | "right" | "bottom" | "left"
  tooltipText: string | null
  className?: string
}

export const IconTooltip = ({
  Icon,
  position,
  tooltipText,
  className
}: IconTooltipProps) => {
  const [tooltipStatus, setTooltipStatus] = useState<boolean>(false)

  const tooltipPositionDefinition = (position: string) => {
    switch (position) {
      case "top":
        return "bottom-[100%] left-[50%] translate-x-[-50%]"
      case "right":
        return "right-[-15px] bottom-[-50%] translate-x-[100%] translate-y-[30%]"
      case "bottom":
        return "top-[100%] left-[50%] translate-x-[-50%] translate-y-[10%]"
      case "left":
        return "left-[-15px] top-[50%] translate-x-[-100%] translate-y-[-50%]"
      default:
        return "bottom-[100%] left-[50%] translate-x-[-50%]"
    }
  }

  const arrowPositionDefinition = (position: string) => {
    switch (position) {
      case "top":
        return "bottom-[-5px] right-[50%] before:translate-x-[50%]"
      case "right":
        return "left-[-5px] top-[50%] before:translate-y-[-50%]"
      case "bottom":
        return "top-[-5px] right-[50%] before:translate-x-[50%]"
      case "left":
        return "right-[-5px] top-[50%] before:translate-y-[-50%]"
      default:
        return "bottom-[-5px] right-[50%] before:translate-x-[50%]"
    }
  }

  return (
    <div
      onMouseEnter={() => setTooltipStatus(true)}
      onMouseLeave={() => setTooltipStatus(false)}
      className={classNames("relative", className)}
    >
      <Icon />
      {tooltipStatus && (
        <div
          role="tooltip"
          className={classNames(
            "absolute z-20 mb-[11px] w-[200px] rounded bg-[#2A242B] p-4 px-[8px] py-[12px] text-[12px] font-medium text-white shadow-lg transition duration-150 ease-in-out",
            tooltipPositionDefinition(position)
          )}
        >
          {tooltipText}
          <span
            className={classNames(
              "absolute z-20 before:block before:h-[12px] before:w-[12px] before:rotate-45 before:bg-[#2A242B] before:content-['']",
              arrowPositionDefinition(position)
            )}
          />
        </div>
      )}
    </div>
  )
}
