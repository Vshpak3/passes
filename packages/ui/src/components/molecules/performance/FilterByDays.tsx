import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import ChevronDown from "public/icons/chevron-down-icon.svg"
import React, { Dispatch, SetStateAction, useRef, useState } from "react"
import { DateRangePicker } from "react-date-range"
import FilterMenu from "src/components/atoms/FilterMenu"
import { getFormattedDate } from "src/helpers"
import { useOnClickOutside } from "src/hooks"

interface IRange {
  startDate: Date
  endDate: Date
  key: string
}

interface IFilterByDays {
  dateRange: IRange
  setDateRange: Dispatch<SetStateAction<IRange>>
}

const FilterByDays: React.FC<IFilterByDays> = ({ dateRange, setDateRange }) => {
  const [showFilterDropDown, setShowFilterDropDown] = useState(false)

  const filterHandler = (startDate: Date, endDate: Date) => {
    setDateRange((prevDate) => ({
      ...prevDate,
      startDate,
      endDate
    }))
    setShowFilterDropDown(false)
  }

  const filterEl = useRef(null)
  useOnClickOutside(filterEl, () => {
    setShowFilterDropDown(false)
  })

  return (
    <div className="relative inline-block" ref={filterEl}>
      <div className="mt-8 rounded-md border border-passes-dark-200 bg-passes-dark-700 py-2.5 px-3 lg:mt-9">
        <span className="text-2xl font-bold leading-6">Last 30 Days</span>
        <button
          type="button"
          className="mt-3 flex items-center space-x-5"
          onClick={() => setShowFilterDropDown((show) => !show)}
        >
          <span className="text-base font-medium text-passes-gray-200">
            {getFormattedDate(dateRange.startDate)} -{" "}
            {getFormattedDate(dateRange.endDate)}
          </span>
          <ChevronDown className="child:stroke-[#767676]" />
        </button>
      </div>

      <input type="checkbox" id="calender-modal" className="modal-toggle" />
      <label htmlFor="calender-modal" className="modal cursor-pointer">
        <label
          className="modal-box relative flex items-center justify-center bg-[#fff]"
          htmlFor=""
        >
          <DateRangePicker
            ranges={[dateRange]}
            onChange={(newRange) => {
              setDateRange(newRange.selection as any)
              setShowFilterDropDown(false)
            }}
          />
        </label>
      </label>
      {showFilterDropDown && <FilterMenu onFilter={filterHandler} />}
    </div>
  )
}

export default FilterByDays
