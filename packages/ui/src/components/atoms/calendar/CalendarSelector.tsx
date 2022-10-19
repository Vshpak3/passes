import classNames from "classnames"
import ScheduledCalendarIcon from "public/icons/calendar-scheduled-purple-icon.svg"
import { FC } from "react"
import { CalendarPicker } from "src/components/atoms/calendar/CalendarPicker"

interface CalendarSelectorProps {
  name: string
  activeHeader: string | undefined
  setScheduledTime: (date: Date | null) => void | Promise<void>
  scheduledTime?: Date | null
}

export const CalendarSelector: FC<CalendarSelectorProps> = ({
  name,
  activeHeader,
  setScheduledTime,
  scheduledTime
}) => {
  return (
    <CalendarPicker scheduledTime={scheduledTime} onSave={setScheduledTime}>
      <span
        className={classNames(
          activeHeader === name
            ? " bg-[rgba(191,122,240,0.1)] "
            : "hover:bg-[rgba(191,122,240,0.1)]",
          "group flex h-full flex-shrink-0 items-center rounded-[56px] py-2 px-3 text-sm leading-4 text-passes-secondary-color sm:px-4 sm:py-3"
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
