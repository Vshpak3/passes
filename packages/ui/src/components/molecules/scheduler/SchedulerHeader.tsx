import Fade from "@mui/material/Fade"
import Popper from "@mui/material/Popper"
import { ChevronLeft, ChevronRight } from "lucide-react"
import moment from "moment"
import PlusQuareIcon from "public/icons/plus-square.svg"
import { FC, useCallback, useRef, useState } from "react"
import MonthYearPicker from "react-month-year-picker"
import CreateSchedulerPopup from "src/components/molecules/scheduler/CreateSchedulerPopup"

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
  const popperContainerRef = useRef<HTMLDivElement | null>(null)

  const [monthYearPopperOpen, setMonthYearPopperOpen] = useState(false)
  const [createScheduleOpen, setCreateScheduleOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [buttonCreateSchedulerEl, setButtonCreateSchedulerEl] =
    useState<null | HTMLElement>(null)

  const handleShowMonthYearPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setMonthYearPopperOpen((previousOpen) => !previousOpen)
  }

  const handleShowCreateSchedulerPopper = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setButtonCreateSchedulerEl(
      buttonCreateSchedulerEl ? null : event.currentTarget
    )
    setCreateScheduleOpen((previousOpen) => !previousOpen)
  }

  const canBeMonthYearPopperOpen = monthYearPopperOpen && Boolean(anchorEl)
  const monthYearPopperId = canBeMonthYearPopperOpen
    ? "transition-popper"
    : undefined

  const canBeCreateSchedulerPopperOpen =
    monthYearPopperOpen && Boolean(anchorEl)
  const createScheduleropperId = canBeCreateSchedulerPopperOpen
    ? "transition-popper"
    : undefined

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

  const dismissCreateSchedulerPopper = useCallback(() => {
    buttonCreateSchedulerEl && setButtonCreateSchedulerEl(null)
  }, [buttonCreateSchedulerEl])

  const { month: availableMonthFrom, year: availableYearFrom } = availableFrom

  return (
    <div className="flex items-center justify-between py-[45px] px-[15px] md:px-[30px]">
      {buttonCreateSchedulerEl && (
        <div
          className="bg-black-100 fixed top-0 left-0 h-screen w-full"
          onClick={dismissCreateSchedulerPopper}
        />
      )}
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
            aria-describedby={monthYearPopperId}
            type="button"
            onClick={handleShowMonthYearPopper}
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
            id={createScheduleropperId}
            open={createScheduleOpen}
            anchorEl={buttonCreateSchedulerEl}
            transition
            placement="bottom-end"
            modifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 17]
                }
              }
            ]}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <div
                  ref={popperContainerRef}
                  className="rounded border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-4 py-6 backdrop-blur-md"
                >
                  <CreateSchedulerPopup
                    onCancel={dismissCreateSchedulerPopper}
                  />
                </div>
              </Fade>
            )}
          </Popper>
          <Popper
            id={monthYearPopperId}
            open={monthYearPopperOpen}
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
                <div className="rounded border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-4 py-6 backdrop-blur-md">
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
      <button
        className="flex appearance-none items-center gap-2 rounded-[50px] bg-passes-primary-color py-[10px] px-[30px] text-white"
        onClick={handleShowCreateSchedulerPopper}
      >
        <PlusQuareIcon />
        <span>Schedule</span>
      </button>
    </div>
  )
}

export default SchedulerHeader
