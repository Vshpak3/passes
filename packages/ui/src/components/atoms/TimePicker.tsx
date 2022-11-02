import classNames from "classnames"
import { Dispatch, FC, SetStateAction, useRef, useState } from "react"

import {
  Time,
  TimeShiftEnum
} from "src/components/atoms/calendar/CalendarPicker"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

const HOURS = 12
const MINUTES = 60

interface TimePickerProps {
  time: Time
  setTime: Dispatch<SetStateAction<Time>>
}

export const TimePicker: FC<TimePickerProps> = ({
  time,
  setTime: _setTime
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownEl = useRef(null)

  useOnClickOutside(dropdownEl, () => {
    setShowDropdown(false)
  })

  const setTime = ({ minutes, hours, timeShift }: Partial<Time>) => {
    _setTime(
      Object.assign(
        { ...time },
        minutes !== undefined ? { minutes } : null,
        hours !== undefined ? { hours } : null,
        timeShift !== undefined ? { timeShift } : null
      )
    )
  }

  const padTime = (n: number) => n.toString().padStart(2, "0")

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <button
          className="w-[98px] rounded-lg border border-white bg-[#0E0A0F] px-5 py-2 text-lg leading-6 text-white focus:border-2 focus:border-blue-700"
          onClick={() => setShowDropdown(true)}
          tabIndex={0}
          type="button"
        >
          {padTime(time.hours + 1)}:{padTime(time.minutes)}
        </button>
        <span className="flex rounded-lg border border-white bg-[#0E0A0F]">
          <button
            className={classNames(
              "duration-400 cursor-pointer rounded-bl-lg rounded-tl-lg py-2 px-3 transition-all hover:bg-white hover:text-passes-gray-200",
              {
                "bg-white text-passes-gray-200":
                  time.timeShift === TimeShiftEnum.AM
              }
            )}
            onClick={() => setTime({ timeShift: TimeShiftEnum.AM })}
            tabIndex={1}
          >
            AM
          </button>
          <button
            className={classNames(
              "duration-400 cursor-pointer rounded-tr-lg rounded-br-lg py-2 px-3 transition-all hover:bg-white hover:text-passes-gray-200",
              {
                "bg-white text-passes-gray-200":
                  time.timeShift === TimeShiftEnum.PM
              }
            )}
            onClick={() => setTime({ timeShift: TimeShiftEnum.PM })}
            tabIndex={1}
          >
            PM
          </button>
        </span>
      </div>

      {showDropdown && (
        <div
          className="absolute top-full z-50 flex h-[178px] w-[113px] translate-y-2 rounded border border-white bg-[#0E0A0F] py-2 text-center text-white"
          ref={dropdownEl}
        >
          <ul className="h-full flex-1 overflow-scroll">
            {Array.from({ length: HOURS }, (_, i) => (
              <li
                className={classNames(
                  "cursor-pointer py-0.5 text-sm font-medium hover:bg-[#edfaff42]",
                  { "bg-[#edfaff42]": time.hours === i }
                )}
                key={i}
                onClick={() => setTime({ hours: i })}
                role="button"
                tabIndex={0}
              >
                {padTime(i + 1)}
              </li>
            ))}
          </ul>
          <ul className="h-full flex-1 overflow-scroll">
            {Array.from({ length: MINUTES }, (_, i) => (
              <li
                className={classNames(
                  "cursor-pointer py-0.5 text-sm font-medium hover:bg-[#edfaff42]",
                  { "bg-[#edfaff42]": time.minutes === i }
                )}
                key={i}
                onClick={() => setTime({ minutes: i })}
                role="button"
                tabIndex={0}
              >
                {padTime(i)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
