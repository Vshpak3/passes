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
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  ComponentArg,
  InfiniteScrollPagination
} from "src/components/atoms/InfiniteScroll"
import { Payout } from "src/components/molecules/payment/Payout"
import { MonthYearPicker } from "src/components/molecules/scheduler/MonthYearPicker"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { useUser } from "src/hooks/useUser"
import { ChevronDown } from "src/icons/ChevronDown"

const api = new PaymentApi()

export const PayoutHistory = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth())
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const { user, loading } = useUser()
  const router = useRouter()

  const endMonths = year * 12 + month + 1
  const startDate = new Date()
  startDate.setMonth(month)
  startDate.setFullYear(year)
  const endDate = new Date()
  endDate.setMonth(endMonths % 12)
  endDate.setFullYear(Math.floor(endMonths / 12))

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])

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
  return (
    <div className="mb-5 flex w-full flex-col gap-4">
      <div className="flex flex-col rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-4">
        <span className="mb-6 text-[20px] font-[700]">Payout History</span>
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <button
            aria-describedby={monthYearPopperId}
            type="button"
            onClick={handleShowMonthYearPopper}
          >
            <span className="w-[100px] select-none">
              {`${format(new Date(2000, month - 1, 1), "MMMM")} ${year}`}
            </span>
          </button>
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
                <div
                  ref={popperMonthYearPickerRef}
                  className="month-year-picker-wrapper rounded border border-[rgba(255,255,255,0.15)] bg-[rgba(27,20,29,0.5)] px-4 py-6 backdrop-blur-md"
                >
                  <MonthYearPicker
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
      <div className="flex flex-col">
        <div className="flex flex-row justify-between border-b border-passes-dark-200">
          <div className=" mb-4 flex flex-1 justify-center">
            <span className="text-[12px] font-[500]">Transaction</span>
          </div>
          <div className=" mb-4 flex flex-1 justify-center">
            <span className="text-[12px] font-[500]">Destination</span>
          </div>
          <div className="mb-4 flex flex-1 items-center justify-center gap-2">
            <span className="text-[12px] font-[500]">Date</span>
            <ChevronDown />
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
          keyValue="/payouts"
          fetch={async (req: GetPayoutsRequestDto) => {
            return await api.getPayouts({ getPayoutsRequestDto: req })
          }}
          fetchProps={{
            startDate,
            endDate
          }}
          KeyedComponent={({ arg }: ComponentArg<PayoutDto>) => {
            return <Payout payout={arg} />
          }}
        />
      </div>
    </div>
  )
}
