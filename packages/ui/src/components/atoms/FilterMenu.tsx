import classNames from "classnames"
import ms from "ms"
import React, { FC } from "react"

const ONE_DAY = ms("1 day")

interface FilterMenuProps {
  className?: string
  onFilter: (startDate: Date, endDate: Date) => void
}

const getPrevDate = (days: number) => {
  return new Date(new Date().valueOf() - days * ONE_DAY)
}

const FilterMenu: FC<FilterMenuProps> = ({ className = "", onFilter }) => {
  const lastDaysFilterHandler = (days: number) => {
    const startDate = getPrevDate(days)
    const lastDate = new Date()
    onFilter(startDate, lastDate)
  }

  return (
    <ul
      className={classNames(
        "text-label absolute w-full translate-y-1.5 rounded-md border border-passes-dark-200 bg-passes-dark-700 py-2.5 px-3",
        className
      )}
    >
      <li className="border-b border-passes-dark-200 pb-2.5">
        <label htmlFor="calender-modal" className="cursor-pointer">
          Custom
        </label>
      </li>

      <li className="pt-2.5">
        <button onClick={() => lastDaysFilterHandler(7)}>Last 7 Days</button>
      </li>
      <li className="pt-2.5">
        <button onClick={() => lastDaysFilterHandler(30)}>Last 30 Days</button>
      </li>
      <li className="pt-2.5">
        <button onClick={() => lastDaysFilterHandler(90)}>Last 90 Days</button>
      </li>
      <li className="border-b border-passes-dark-200 py-2.5">
        <button onClick={() => lastDaysFilterHandler(365)}>
          Last 365 Days
        </button>
      </li>

      <li className="pt-2.5">
        <button>2022</button>
      </li>
      <li className="border-b border-passes-dark-200 py-2.5">
        <button>All time</button>
      </li>

      <li className="pt-2.5">
        <button>September</button>
      </li>
      <li className="pt-2.5">
        <button>August</button>
      </li>
    </ul>
  )
}

export default FilterMenu
