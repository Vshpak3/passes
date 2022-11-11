import { ScheduledEventDto } from "@passes/api-client"
import classNames from "classnames"
import { format } from "date-fns"
import { FC } from "react"

import { IconTooltip } from "src/components/atoms/IconTooltip"
import { plural } from "src/helpers/plural"

interface CalendarEntry {
  name: string
  scheduledData: ScheduledEventDto[]
  className: string
}

export const CalendarEntry: FC<CalendarEntry> = ({
  name,
  scheduledData,
  className
}) => {
  return (
    <>
      {scheduledData.length > 0 && (
        <div
          className={classNames(
            "w-full rounded px-2 py-[2px] text-left font-bold leading-6 text-white",
            className
          )}
        >
          <IconTooltip
            position="top"
            tooltipClassName="mb-[9px] pl-5 w-[100px] opacity-100"
            tooltipText={scheduledData
              .map((p) => format(p.scheduledAt, "hh:mm a"))
              .join("\n")}
          >
            <span className="flex text-xs md:hidden">
              {scheduledData.length}
            </span>
            <span className="hidden text-sm md:flex">
              {plural(name, scheduledData.length)}
            </span>
          </IconTooltip>
        </div>
      )}
    </>
  )
}
