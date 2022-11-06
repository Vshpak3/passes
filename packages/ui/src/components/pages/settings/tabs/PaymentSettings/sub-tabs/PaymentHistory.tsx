import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { Fade, Popper } from "@mui/material"
import {
  GetPayinsRequestDto,
  GetPayinsResponseDto,
  PayinDto,
  PaymentApi
} from "@passes/api-client"
import { format } from "date-fns"
import { memo, useCallback, useRef, useState } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Payin } from "src/components/molecules/payment/Payin"
import { MonthYearPicker } from "src/components/molecules/scheduler/MonthYearPicker"
import { Tab } from "src/components/pages/settings/Tab"
import { getStartEnd } from "src/helpers/monthYear"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

const PaymentHistory = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [year, setYear] = useState<number>(new Date().getFullYear())

  const [startDate, endDate] = getStartEnd(month, year)

  const handleChangeTime = useCallback((type: string, value: number) => {
    if (type === "month") {
      setMonth(value)
    }
    if (type === "year") {
      setYear(value)
    }
  }, [])

  const [monthYearPopperOpen, setMonthYearPopperOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const canBeMonthYearPopperOpen = monthYearPopperOpen && Boolean(anchorEl)
  const handleShowMonthYearPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setMonthYearPopperOpen(true)
  }
  const popperMonthYearPickerRef = useRef<HTMLDivElement | null>(null)
  useOnClickOutside(popperMonthYearPickerRef, () => {
    setMonthYearPopperOpen(false)
  })
  const monthYearPopperId = canBeMonthYearPopperOpen
    ? "transition-popper"
    : undefined

  const api = new PaymentApi()

  return (
    <>
      <Tab title="Payment History" withBack />
      <button
        aria-describedby={monthYearPopperId}
        className="my-4"
        onClick={handleShowMonthYearPopper}
        type="button"
      >
        <span className="w-[100px] select-none">
          {`${format(new Date(2000, month, 1), "MMMM")} ${year}`}
        </span>
      </button>
      <Popper
        anchorEl={anchorEl}
        id={monthYearPopperId}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10]
            }
          }
        ]}
        open={monthYearPopperOpen}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div
              className="rounded border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-4 py-6 backdrop-blur-md"
              ref={popperMonthYearPickerRef}
            >
              <MonthYearPicker
                onChangeMonth={(month: number) =>
                  handleChangeTime("month", month)
                }
                onChangeYear={(year: number) => handleChangeTime("year", year)}
                selectedMonth={month}
                selectedYear={year}
              />
            </div>
          </Fade>
        )}
      </Popper>
      <div className="mb-5 flex w-full flex-col gap-4">
        <div className="flex flex-row items-center justify-between rounded-[15px] border border-passes-dark-200 bg-[#1B141D]/50 p-4">
          <span className="text-[16px] font-[700]">
            Payments Transaction History
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between border-b border-passes-dark-200">
            <div className="mb-4 flex flex-1 justify-center">
              <span className="text-[12px] font-[500]">Transaction</span>
            </div>
            <div className="mb-4 flex flex-1 justify-center">
              <span className="text-[12px] font-[500]">Source</span>
            </div>
            <div className="mb-4 flex flex-1 items-center justify-center gap-2">
              <span className="text-[12px] font-[500]">Date</span>
            </div>
            <div className="flex flex-1 justify-center">
              <span className="mb-4 text-[12px] font-[500]">Amount</span>
            </div>
            <div className="flex flex-1 justify-center">
              <span className="mb-4 text-[12px] font-[500]">
                Payment Method
              </span>
            </div>
            <div className="flex flex-1 justify-center">
              <span className="mb-4 text-[12px] font-[500]">Status</span>
            </div>
            <div className="flex flex-1 justify-center">
              <span className="mb-4 text-[12px] font-[500]">Reason</span>
            </div>
            <div className="mb-4 flex flex-1 justify-center">
              <span className="text-[12px] font-[500]">Cancel</span>
            </div>
          </div>
          <InfiniteScrollPagination<PayinDto, GetPayinsResponseDto>
            KeyedComponent={({ arg }: ComponentArg<PayinDto>) => {
              return <Payin payin={arg} />
            }}
            fetch={async (req: GetPayinsRequestDto) => {
              return await api.getPayins({ getPayinsRequestDto: req })
            }}
            fetchProps={{
              startDate,
              endDate
            }}
            keyValue="/payins"
            options={{ revalidateOnMount: true }}
          />
        </div>
      </div>
    </>
  )
}

export default memo(PaymentHistory) // eslint-disable-line import/no-default-export
