import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { Fade, Popper } from "@mui/material"
import {
  GetPayoutsRequestDto,
  GetPayoutsResponseDto,
  PaymentApi,
  PayoutDto
} from "@passes/api-client"
import { format } from "date-fns"
import ms from "ms"
import { useCallback, useMemo, useRef, useState } from "react"

import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Payout } from "src/components/molecules/payment/Payout"
import { MonthYearPicker } from "src/components/molecules/scheduler/MonthYearPicker"
import { getStartEnd } from "src/helpers/monthYear"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"

export const PayoutHistory = () => {
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

  const fetchProps = useMemo(() => {
    return { startDate, endDate }
  }, [startDate, endDate])
  return (
    <div className="mb-5 flex w-full flex-col gap-4">
      <div className="flex flex-row items-center justify-between rounded-[15px] p-4">
        <span className="items-center text-[20px] font-[700]">
          Payout History
        </span>
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <button
            aria-describedby={monthYearPopperId}
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
                    onChangeYear={(year: number) =>
                      handleChangeTime("year", year)
                    }
                    selectedMonth={month}
                    selectedYear={year}
                  />
                </div>
              </Fade>
            )}
          </Popper>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between border-b border-passes-dark-200">
          <div className="mb-4 flex flex-1 justify-center">
            <span className="text-[12px] font-[500]">Transaction</span>
          </div>
          <div className="mb-4 flex flex-1 justify-center">
            <span className="text-[12px] font-[500]">Destination</span>
          </div>
          <div className="mb-4 flex flex-1 items-center justify-center gap-2">
            <span className="text-[12px] font-[500]">Date</span>
          </div>
          <div className="flex flex-1 justify-center">
            <span className="mb-4 text-[12px] font-[500]">Amount</span>
          </div>
          <div className="flex flex-1 justify-center">
            <span className="mb-4 text-[12px] font-[500]">Payout Method</span>
          </div>
          <div className="flex flex-1 justify-center">
            <span className="mb-4 text-[12px] font-[500]">Status</span>
          </div>
        </div>
        <InfiniteScrollPagination<PayoutDto, GetPayoutsResponseDto>
          KeyedComponent={({ arg }: ComponentArg<PayoutDto>) => {
            return <Payout payout={arg} />
          }}
          fetch={async (req: GetPayoutsRequestDto) => {
            return await api.getPayouts({ getPayoutsRequestDto: req })
          }}
          fetchProps={fetchProps}
          keySelector="payoutId"
          keyValue="/pages/payouts"
          options={{
            refreshInterval: ms("3 seconds")
          }}
        />
      </div>
    </div>
  )
}
