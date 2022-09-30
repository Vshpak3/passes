import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { PaymentApi, PayoutDto } from "@passes/api-client"
import ms from "ms"
import CalendarIcon from "public/icons/calendar-blank-outline.svg"
import SearchIcon from "public/icons/header-search-icon-2.svg"
import { useCallback, useEffect, useRef, useState } from "react"
import { DateRangePicker } from "react-date-range"
import { getFormattedDate } from "src/helpers"
import { useOnClickOutside } from "src/hooks"

import ChevronDown from "../../../icons/chevron-down"

const PAGE_SIZE = 7
const ONE_DAY = ms("1 day")

const PastTransactions = () => {
  const [payouts, setPayouts] = useState<PayoutDto[]>([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [showFilterDropDown, setShowFilterDropDown] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [dateRange, setDateRange] = useState({
    startDate: new Date("2020-01-01"),
    endDate: new Date(),
    key: "selection"
  })

  const fetchPayouts = useCallback(async () => {
    const api = new PaymentApi()
    const data = await api.getPayouts({
      getPayoutsRequestDto: { offset: offset, limit: PAGE_SIZE }
    })
    setPayouts(data.payouts)
    setCount(data.count)
  }, [offset])

  useEffect(() => {
    fetchPayouts()
  }, [fetchPayouts])

  const setRangeHandler = useCallback(
    (days: number) => {
      setDateRange((prevDate) => ({
        ...prevDate,
        startDate: getPrevDate(days),
        endDate: new Date()
      }))
      setShowFilterDropDown(false)
    },
    [setDateRange]
  )

  const filterEl = useRef(null)
  useOnClickOutside(filterEl, () => {
    setShowFilterDropDown(false)
  })

  const getPrevDate = (days: number) => {
    return new Date(new Date().valueOf() - days * ONE_DAY)
  }

  if (!payouts) {
    return null
  }
  return (
    <div className="mb-5 flex w-full flex-col gap-4">
      <div className="flex flex-col rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-4">
        <span className="mb-6 text-[20px] font-[700]">Payout History</span>
        <div className="flex flex-col justify-between gap-2 md:flex-row">
          <div className="relative flex items-center gap-3">
            <SearchIcon className="pointer-events-none  absolute top-1/2 left-[14px] -translate-y-1/2 transform" />
            <input
              type="search"
              name="search"
              id="search"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              autoComplete="off"
              placeholder="Search for payout"
              className="form-input h-[44px] w-full min-w-[360px] rounded-md border-transparent bg-[#191919] pl-11 text-[#ffffff] outline-none placeholder:text-[16px] placeholder:text-[#ffffff]/30 focus:ring-0"
            />
          </div>
          <div className="relative inline-block" ref={filterEl}>
            <div className="form-input h-[44px] w-full rounded-md border-transparent bg-[#191919] pl-11 text-[#ffffff] outline-none">
              <button
                type="button"
                className="flex items-center space-x-5"
                onClick={() => setShowFilterDropDown((show) => !show)}
              >
                <CalendarIcon className="pointer-events-none absolute top-1/2 left-[14px] h-[20px] w-[20px] -translate-y-1/2 transform fill-white" />
                {getFormattedDate(dateRange.startDate)} -{" "}
                {getFormattedDate(dateRange.endDate)}
              </button>
            </div>

            <input
              type="checkbox"
              id="calender-modal"
              className="modal-toggle"
            />
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
            {showFilterDropDown && (
              <ul className="text-label absolute -top-2 w-full -translate-y-full transform rounded-md border border-passes-dark-200 bg-passes-dark-700 py-2.5 px-3">
                <li className="border-b border-passes-dark-200 pb-2.5">
                  <label htmlFor="calender-modal" className="cursor-pointer">
                    Custom
                  </label>
                </li>

                <li className="pt-2.5">
                  <button onClick={() => setRangeHandler(7)}>
                    Last 7 Days
                  </button>
                </li>
                <li className="pt-2.5">
                  <button onClick={() => setRangeHandler(30)}>
                    Last 30 Days
                  </button>
                </li>
                <li className="pt-2.5">
                  <button onClick={() => setRangeHandler(90)}>
                    Last 90 Days
                  </button>
                </li>
                <li className="border-b border-passes-dark-200 py-2.5">
                  <button onClick={() => setRangeHandler(365)}>
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
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between border-b border-passes-dark-200">
          <div className=" mb-4 flex flex-1 justify-center">
            <span className="text-[12px] font-[500]">Transaction ID</span>
          </div>
          <div className="mb-4 flex flex-1 items-center justify-center gap-2">
            <span className="text-[12px] font-[500]">Date</span>
            <ChevronDown />
          </div>
          <div className="flex flex-1 justify-center">
            <span className="mb-4 text-[12px] font-[500]">Amount</span>
          </div>
          <div className="flex flex-1 justify-center">
            <span className="mb-4 text-[12px] font-[500]">Payment Method</span>
          </div>
          <div className="flex flex-1 justify-center">
            <span className="mb-4 text-[12px] font-[500]">Status</span>
          </div>
        </div>
        {payouts
          .filter(
            (transaction) =>
              searchValue === "" ||
              // eslint-disable-next-line prettier/prettier
              transaction?.transactionHash
                ?.toLowerCase()
                .includes(searchValue.toLowerCase())
          )
          .map((transaction, index) => (
            <div
              key={index}
              className="flex flex-row justify-between border-b border-passes-dark-200"
            >
              <div className="flex h-[72px] flex-1 items-center justify-center">
                <span className="text-[14px] font-[700] text-passes-pink-100">
                  {transaction.transactionHash ?? "N/A"}
                </span>
              </div>
              <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
                <span className="text-[12px] font-[500]">
                  {new Date(transaction.createdAt)
                    .toISOString()
                    .substring(0, 10) ?? "N/A"}
                </span>
              </div>
              <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
                <span className="text-[12px] font-[500]">
                  {transaction.amount ?? "N/A"}
                </span>
              </div>
              <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
                <span className="text-[12px] font-[500]">
                  {transaction.payoutMethod.method ?? "N/A"}
                </span>
              </div>
              <div className="flex h-[72px] flex-1 items-center justify-center">
                <div className="mt-1 mr-1 rounded-full bg-[#667085] p-1" />
                <span className="text-[12px] font-[500]">
                  {transaction.payoutStatus ?? "N/A"}
                </span>
              </div>
            </div>
          ))}
      </div>
      <div className="flex w-full flex-row justify-between px-10">
        <span className="text-[14px] font-[500] text-[#646464]">{`Page ${offset} of ${count}`}</span>
        <div className="flex gap-4">
          <button
            disabled={offset === 0}
            onClick={() => setOffset(offset - 1)}
            className="rounded-[6px] bg-[#322F33] py-[9px] px-[17px] hover:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={offset === count}
            onClick={() => setOffset(offset + 1)}
            className="rounded-[6px] bg-[#322F33] py-[9px] px-[17px] hover:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default PastTransactions
