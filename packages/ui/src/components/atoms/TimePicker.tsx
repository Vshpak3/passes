import classNames from "classnames"
import { Dispatch, FC, SetStateAction, useRef, useState } from "react"
import {
  Time,
  TimeShiftEnum
} from "src/components/molecules/scheduler/CalendarPicker"
import { useOnClickOutside } from "src/hooks"

const padZero = (n: number) => n.toString().padStart(2, "0")

export interface TimePickerProps {
  time: Time
  setTime: Dispatch<SetStateAction<Time>>
  defualtTime?: { hours: number; minutes: number }
}

const TimePicker: FC<TimePickerProps> = ({ time, setTime }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownEl = useRef(null)

  useOnClickOutside(dropdownEl, () => {
    setShowDropdown(false)
  })

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <button
          tabIndex={0}
          className="w-[98px] rounded-lg border border-white bg-[#0E0A0F] px-5 py-2 text-lg leading-6 text-white focus:border-2 focus:border-blue-700"
          type="button"
          onClick={() => setShowDropdown(true)}
        >
          {padZero(time.hours)}:{padZero(time.minutes)}
        </button>
        <span className="flex rounded-lg border border-white bg-[#0E0A0F]">
          <button
            tabIndex={1}
            onClick={() =>
              setTime((prevTime) => ({
                ...prevTime,
                timeShift: TimeShiftEnum.AM
              }))
            }
            className={classNames(
              "duration-400 cursor-pointer rounded-bl-lg rounded-tl-lg py-2 px-3 transition-all hover:bg-white hover:text-passes-gray-200",
              {
                "bg-white text-passes-gray-200":
                  time.timeShift === TimeShiftEnum.AM
              }
            )}
          >
            AM
          </button>
          <button
            tabIndex={1}
            onClick={() =>
              setTime((prevTime) => ({
                ...prevTime,
                timeShift: TimeShiftEnum.PM
              }))
            }
            className={classNames(
              "duration-400 cursor-pointer rounded-tr-lg rounded-br-lg py-2 px-3 transition-all hover:bg-white hover:text-passes-gray-200",
              {
                "bg-white text-passes-gray-200":
                  time.timeShift === TimeShiftEnum.PM
              }
            )}
          >
            PM
          </button>
        </span>
      </div>

      {showDropdown && (
        <div
          ref={dropdownEl}
          className="absolute top-full z-50 flex h-[178px] w-[113px] translate-y-2 rounded border border-white bg-[#0E0A0F] py-2 text-center text-white"
        >
          <ul className="h-full flex-1 overflow-scroll">
            {Array.from({ length: 12 }, (_, i) => (
              <li
                onClick={() =>
                  setTime((prevTime) => ({
                    ...prevTime,
                    hours: i + 1
                  }))
                }
                role="button"
                tabIndex={0}
                className={classNames(
                  "cursor-pointer py-0.5 text-sm font-medium hover:bg-[#edfaff42]",
                  { "bg-[#edfaff42]": time.hours === i + 1 }
                )}
                key={i}
              >
                {padZero(i + 1)}
              </li>
            ))}
          </ul>
          <ul className="h-full flex-1 overflow-scroll">
            {Array.from({ length: 60 }, (_, i) => (
              <li
                onClick={() =>
                  setTime((prevTime) => ({ ...prevTime, minutes: i }))
                }
                role="button"
                tabIndex={0}
                className={classNames(
                  "cursor-pointer py-0.5 text-sm font-medium hover:bg-[#edfaff42]",
                  { "bg-[#edfaff42]": time.minutes === i }
                )}
                key={i}
              >
                {padZero(i)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TimePicker
