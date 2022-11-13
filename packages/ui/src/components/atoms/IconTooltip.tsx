import classNames from "classnames"
import { FC, PropsWithChildren, SVGProps, useState } from "react"

interface IconTooltipProps {
  icon?: FC<SVGProps<SVGSVGElement>>
  position: "top" | "right" | "bottom" | "left"
  tooltipText: string | null | JSX.Element
  tooltipClassName?: string
}

export const IconTooltip: FC<PropsWithChildren<IconTooltipProps>> = ({
  icon: Icon,
  position,
  tooltipText,
  tooltipClassName,
  children
}) => {
  const [tooltipStatus, setTooltipStatus] = useState<boolean>(false)

  const tooltipPositionDefinition = (position: string) => {
    switch (position) {
      case "top":
        return "bottom-[100%] left-[50%] translate-x-[-50%] mb-2"
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
      className="relative z-10"
      onMouseEnter={() => setTooltipStatus(true)}
      onMouseLeave={() => setTooltipStatus(false)}
    >
      {Icon && <Icon />}
      {children}
      {tooltipStatus && (
        <div
          className={classNames(
            "passes-break whitepace-pre-wrap absolute z-10 w-[200px] rounded bg-[#2B2426] p-3 text-[12px] font-medium text-white shadow-lg transition duration-150 ease-in-out",
            tooltipPositionDefinition(position),
            tooltipClassName
          )}
          role="tooltip"
        >
          {tooltipText}
          <span
            className={classNames(
              "absolute z-10 before:block before:h-[12px] before:w-[12px] before:rotate-45 before:bg-[#2B2426] before:content-['']",
              arrowPositionDefinition(position)
            )}
          />
        </div>
      )}
    </div>
  )
}
