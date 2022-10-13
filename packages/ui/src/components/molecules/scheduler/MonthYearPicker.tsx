import { format } from "date-fns"
import React, { FC } from "react"

interface MonthYearPickerProps {
  selectedYear: number
  selectedMonth: number
  minYear: number
  maxYear: number
  onChangeYear: any
  onChangeMonth: any
}

export const MonthYearPicker: FC<MonthYearPickerProps> = ({
  selectedYear,
  selectedMonth,
  minYear,
  maxYear,
  onChangeYear,
  onChangeMonth
}) => {
  const handleOnClickLeftArrow = () => {
    if (selectedYear < minYear) {
      onChangeYear(selectedYear - 1)
    }
  }

  const handleOnClickRightArrow = () => {
    if (selectedYear <= maxYear) {
      onChangeYear(selectedYear + 1)
    }
  }

  return (
    <div className="month-year-picker">
      <div className="year-picker">
        <span>{selectedYear}</span>
        <div className="controls">
          <>
            {selectedYear === minYear ? (
              <i className="fa fa-chevron-left disabled"></i>
            ) : (
              <i
                role="button"
                tabIndex={0}
                onClick={handleOnClickLeftArrow}
                className="fa fa-chevron-left"
              ></i>
            )}
            {selectedYear === maxYear ? (
              <i className="fa fa-chevron-right disabled"></i>
            ) : (
              <i
                role="button"
                tabIndex={0}
                onClick={handleOnClickRightArrow}
                className="fa fa-chevron-right"
              ></i>
            )}
          </>
        </div>
      </div>
      <div className="month-picker">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              {Array(4)
                .fill(0)
                .map((_, j) => (
                  <div
                    key={i * 4 + j}
                    className={selectedMonth === i * 4 + j ? "selected" : ""}
                    role="button"
                    tabIndex={0}
                    onClick={() => onChangeMonth(i * 4 + j)}
                  >
                    <div>
                      <span>{format(new Date(2000, i * 4 + j, 1), "MM")}</span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  )
}
