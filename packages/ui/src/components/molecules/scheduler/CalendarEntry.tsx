import { ScheduledEventDto } from "@passes/api-client"
import classNames from "classnames"
import { format } from "date-fns"
import { FC } from "react"

import { IconTooltip } from "src/components/atoms/IconTooltip"

interface CalendarEntry {
  scheduledData: ScheduledEventDto[]
  className: string
}

export const CalendarEntry: FC<CalendarEntry> = ({
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
            tooltipClassName="mb-[11px] pl-5 w-[100px]"
            tooltipText={scheduledData
              .map((p) => format(p.scheduledAt, "hh:mm a"))
              .join("\n")}
          >
            {scheduledData.length}
          </IconTooltip>
        </div>
      )}
    </>
  )
}
