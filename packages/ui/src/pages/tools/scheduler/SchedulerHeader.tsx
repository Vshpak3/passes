import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import { ChevronLeft, ChevronRight } from "lucide-react"
import moment from "moment"
import { FC, useCallback, useState } from "react"
import MonthYearPicker from "react-month-year-picker"

const today = new Date()

const css = `
  .month-year-picker {
    margin-top: 0px;
  }
  .year-picker > span {
    color: #9C4DC1!important;
    font-weight: 700;
  }
  .month-year-picker .month-picker > div > div {
    border-radius: 8px!important;
    color: white!important;
    font-weight: bold;
    background-color: #2C282D!important;
  }
  .month-year-picker .month-picker > div > div:not(selected):hover {
    background-color: #4f4d4f!important;
    transition: 0.1s all linear;
  }
  .month-year-picker .month-picker > div > div.selected {
    color: white!important;
    background: #9C4DC1!important;
  }
`

interface SchedulerHeaderProps {
  onChangeTime: (month: number, year: number) => void
  availableFrom: { month: number; year: number }
}

const SchedulerHeader: FC<SchedulerHeaderProps> = ({
  onChangeTime,
  availableFrom
}) => {
  const [month, setMonth] = useState<number>(today.getMonth())
  const [year, setYear] = useState<number>(today.getFullYear())

  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleShowPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen((previousOpen) => !previousOpen)
  }
  const canBeOpen = open && Boolean(anchorEl)
  const id = canBeOpen ? "transition-popper" : undefined

  const handleChangeTime = useCallback(
    (type: string, value: number) => {
      if (type === "month") {
        setMonth(value)
        onChangeTime(value, year)
      }
      if (type === "year") {
        setYear(value)
        onChangeTime(month, value)
      }
    },
    [month, onChangeTime, year]
  )

  const handleGoPrevious = useCallback(() => {
    const previousMonth = month - 1
    if (previousMonth === -1) {
      onChangeTime(12, year - 1)
      setMonth(12)
      setYear(year - 1)
    } else {
      onChangeTime(previousMonth, year)
      setMonth(previousMonth)
      setYear(year)
    }
  }, [month, year, onChangeTime])

  const handleGoNext = useCallback(() => {
    const nextMonth = month + 1
    if (nextMonth === 12) {
      onChangeTime(0, year + 1)
      setMonth(0)
      setYear(year + 1)
    } else {
      onChangeTime(nextMonth, year)
      setMonth(nextMonth)
      setYear(year)
    }
  }, [month, year, onChangeTime])

  // TODO: this was breaking builds
  // const { month: availableMonthFrom, year: availableYearFrom } = availableFrom
  console.log(availableFrom)
  const { month: availableMonthFrom, year: availableYearFrom } = {
    month: 1,
    year: 2022
  }

  return (
    <div className="flex items-center justify-between py-[45px] px-[15px] md:px-[30px]">
      <style>{`${css}`}</style>
      <div className="select-none text-base font-bold md:text-2xl">
        Scheduler
      </div>
      <div className="flex items-center justify-between text-base font-bold md:w-[300px] md:text-2xl">
        <div className="flex items-center gap-1">
          {availableMonthFrom === month && availableYearFrom === year ? null : (
            <ChevronLeft
              size={32}
              className="cursor-pointer"
              onClick={handleGoPrevious}
            />
          )}
          <button
            aria-describedby={id}
            type="button"
            onClick={handleShowPopper}
          >
            <span className="w-[200px] select-none">
              {`${moment().month(month).format("MMMM")} ${year}`}
            </span>
          </button>
          <ChevronRight
            size={32}
            className="cursor-pointer"
            onClick={handleGoNext}
          />
          <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            transition
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 10]
                }
              }
            ]}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <div className="rounded-md border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-4 py-6 backdrop-blur-md">
                  <MonthYearPicker
                    minYear={2000}
                    caption="Pick your month and year"
                    selectedMonth={month}
                    selectedYear={year}
                    onChangeYear={(year: number) =>
                      handleChangeTime("year", year)
                    }
                    onChangeMonth={(month: number) =>
                      handleChangeTime("month", month)
                    }
                  />
                </div>
              </Fade>
            )}
          </Popper>
        </div>
      </div>
      <span />
    </div>
  )
}

export default SchedulerHeader
