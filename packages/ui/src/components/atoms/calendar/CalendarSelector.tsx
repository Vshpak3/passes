import classNames from "classnames"
import ScheduledCalendarIcon from "public/icons/calendar-scheduled-purple-icon.svg"
import { FC, useState } from "react"

import {
  CalendarPicker,
  CalendarPickerProps
} from "src/components/atoms/calendar/CalendarPicker"

interface CalendarSelectorProps {
  name: string
  activeHeader: string | undefined
  setScheduledTime: (date: Date | null) => void | Promise<void>
  scheduledTime?: Date | null
  placement: CalendarPickerProps["placement"]
}

export const CalendarSelector: FC<CalendarSelectorProps> = ({
  name,
  activeHeader,
  setScheduledTime,
  scheduledTime,
  placement
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <CalendarPicker
      onSave={setScheduledTime}
      placement={placement}
      scheduledTime={scheduledTime}
      setOpen={setIsOpen}
    >
      <span
        className={classNames(
          activeHeader === name || isOpen
            ? " bg-passes-primary-color/10"
            : "hover:bg-passes-primary-color/10",
          "group flex h-full flex-shrink-0 items-center rounded-[56px] py-2 px-3 text-sm leading-4 text-passes-primary-color sm:px-4 sm:py-3"
        )}
      >
        <span className="flex shrink-0 cursor-pointer items-center gap-1">
          <ScheduledCalendarIcon className="flex shrink-0" />
          <span
            className={classNames(
              activeHeader === name || isOpen
                ? "block"
                : "hidden group-hover:block",
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
