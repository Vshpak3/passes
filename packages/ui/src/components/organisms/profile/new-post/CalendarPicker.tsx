import classNames from "classnames"
import { addMonths } from "date-fns"
import ScheduledCalendarIcon from "public/icons/calendar-scheduled-purple-icon.svg"
import { FC } from "react"
import { CalendarPicker } from "src/components/molecules/scheduler/CalendarPicker"
import { MAX_POST_SCHEDULE_DURATION_IN_MONTHS } from "src/config/constants"

interface CalendarSelectorProps {
  name: string
  activeHeader: string | undefined
  setScheduledTime: (date: Date | null) => void
  scheduledTime?: Date | null
}

export const CalendarSelector: FC<CalendarSelectorProps> = ({
  name,
  activeHeader,
  setScheduledTime,
  scheduledTime
}) => {
  return (
    <CalendarPicker
      scheduledTime={scheduledTime}
      onSave={setScheduledTime}
      toDate={addMonths(new Date(), MAX_POST_SCHEDULE_DURATION_IN_MONTHS)}
    >
      <span
        className={classNames(
          activeHeader === name
            ? " bg-[rgba(191,122,240,0.1)] "
            : "hover:bg-[rgba(191,122,240,0.1)]",
          "group flex flex-shrink-0 items-center rounded-[56px] py-3 px-3 text-sm leading-4 text-passes-secondary-color sm:px-4"
        )}
      >
        <span className="flex flex-shrink-0 cursor-pointer items-center gap-1">
          <ScheduledCalendarIcon className="flex flex-shrink-0" />
          <span
            className={classNames(
              activeHeader === name ? "block" : "hidden group-hover:block",
              "block"
            )}
          >
            {name}
          </span>
        </span>
      </span>
    </CalendarPicker>
  )
}
