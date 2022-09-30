import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import {
  CircleBankDto,
  PayinDto,
  PaymentApi,
  PayoutMethodDto
} from "@passes/api-client"
import ms from "ms"
import { useRouter } from "next/router"
import AmexCardIcon from "public/icons/amex-icon.svg"
import CalendarIcon from "public/icons/calendar-blank-outline.svg"
import DiscoverCardIcon from "public/icons/discover-icon.svg"
import MasterCardIcon from "public/icons/mastercard-icon.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import VisaIcon from "public/icons/visa-icon.svg"
import WalletEditIcon from "public/icons/wallet-edit.svg"
import WalletIcon from "public/icons/wallet-manage.svg"
import { useCallback, useEffect, useRef, useState } from "react"
import { DateRangePicker } from "react-date-range"
import { toast } from "react-toastify"
import { Button } from "src/components/atoms"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import { getFormattedDate } from "src/helpers"
import { useOnClickOutside, usePayment, useUser } from "src/hooks"
import BankIcon from "src/icons/bank-icon"
import ChevronDown from "src/icons/chevron-down"

import Tab from "../../../Tab"

const ONE_DAY = ms("1 day")
const PAGE_SIZE = 7

const PaymentSettings = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext
  const [payins, setPayins] = useState<PayinDto[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [banks, setBanks] = useState<CircleBankDto[]>([])
  const [defaultPayout, setDefaultPayout] = useState<PayoutMethodDto>()
  const [currentPage, setCurrentPage] = useState(0)
  const [showFilterDropDown, setShowFilterDropDown] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: new Date("2022-01-01"),
    endDate: new Date(),
    key: "selection"
  })

  const { cards, defaultPayinMethod: defaultPayin } = usePayment()

  const filteredDefaultPayment = cards.find(
    (card) => card.id === defaultPayin?.cardId
  )

  const { user, loading } = useUser()
  const router = useRouter()

  const getBanks = useCallback(async (paymentApi: PaymentApi) => {
    setBanks((await paymentApi.getCircleBanks()).banks)
  }, [])

  const getDefaultPayout = useCallback(async (api: PaymentApi) => {
    try {
      setDefaultPayout(await api.getDefaultPayoutMethod())
    } catch (error: any) {
      toast.error(error)
      setDefaultPayout(undefined)
    }
  }, [])

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    if (!user) {
      router.push("/login")
    }
    const fetchData = async () => {
      const paymentApi = new PaymentApi()
      await getBanks(paymentApi)
      await getDefaultPayout(paymentApi)
    }
    fetchData()
  }, [router, user, loading, getBanks, getDefaultPayout])

  const filteredDefaultPayout = banks.find(
    (bank) => bank.id === defaultPayout?.bankId
  )

  const fetchPayouts = useCallback(async () => {
    const api = new PaymentApi()
    const data = await api.getPayins({
      getPayinsRequestDto: { offset: currentPage * PAGE_SIZE, limit: PAGE_SIZE }
    })

    setPayins(data.payins)

    // Show 1 (empty) page if no data, instead of Page 0 of 0
    setTotalPages(data.count > 0 ? Math.ceil(data.count / PAGE_SIZE) : 1)
  }, [currentPage])

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

  const displayCardIcon = (cardDigit: string) => {
    switch (cardDigit) {
      case "4":
        return <VisaIcon width={25} height={25} />
      case "5":
        return <MasterCardIcon width={25} height={25} />
      case "3":
        return <AmexCardIcon width={25} height={25} />
      case "6":
        return <DiscoverCardIcon width={25} height={25} />
      default:
        return null
    }
  }

  const isCreator = true
  return (
    <>
      <Tab withBack title="Payment Settings" />

      <div className="my-8 flex flex-col gap-6 xl:flex-row">
        {isCreator && (
          <div className="flex w-[248px] flex-col justify-center gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-6">
            <span className="text-[14px] font-[400] opacity-90">
              Default Payout Method:
            </span>
            <div className="flex gap-6">
              <span className="text-[16px] font-[700]">
                {filteredDefaultPayout?.description.split(",")[0]}
              </span>
              <span className="text-[16px] font-[500]">
                {filteredDefaultPayout?.country}
              </span>
            </div>
            <span className="text-[14px] font-[500] opacity-70">
              {filteredDefaultPayout?.description.split(",")[1]}
            </span>
            <Button
              icon={<BankIcon />}
              variant="purple-light"
              tag="button"
              className="!px-4 !py-2.5"
              onClick={() => addTabToStackHandler(SubTabsEnum.ManageBank)}
            >
              Manage Payout
            </Button>
          </div>
        )}
        <div className="flex  w-[248px] flex-col justify-center gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-6">
          <span className="text-[14px] font-[400] opacity-90">
            Default Payment Method:
          </span>
          <span className="text-[16px] font-[700]">
            {filteredDefaultPayment?.fourDigits}
          </span>
          <div className="flex gap-6">
            <span className="text-[14px] font-[500] opacity-70">
              *******{filteredDefaultPayment?.fourDigits}
            </span>
            {displayCardIcon(filteredDefaultPayment?.firstDigit ?? "")}
          </div>
          <Button
            icon={<WalletEditIcon />}
            variant="purple-light"
            tag="button"
            className="!px-4 !py-2.5"
            onClick={() => addTabToStackHandler(SubTabsEnum.ManageCard)}
          >
            Manage Payment
          </Button>
        </div>
        <div className="flex  w-[248px] flex-col justify-center gap-6 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-6">
          <span className="text-[14px] font-[400] opacity-90">
            Default Wallet:
          </span>
          <div className="flex items-center gap-6">
            <span className="text-[16px] font-[700]">Axy...56huad</span>
            <MetamaskIcon />
          </div>
          <Button
            icon={<WalletIcon />}
            variant="purple-light"
            tag="button"
            className="!px-4 !py-2.5"
            onClick={() =>
              addTabToStackHandler(SubTabsEnum.WalletManagementSettings)
            }
          >
            Manage Wallet
          </Button>
        </div>
      </div>

      <div className="mb-5 flex w-full flex-col gap-4">
        <div className="flex flex-row items-center justify-between rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-4">
          <span className="text-[16px] font-[700]">
            Payments Transaction History
          </span>
          <div className="flex flex-col gap-2 md:flex-row">
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
              <span className="text-[12px] font-[500]">Transaction Hash</span>
            </div>
            <div className="flex flex-1 justify-center">
              <span className="mb-4 text-[12px] font-[500]">Payment Info</span>
            </div>
            <div className="mb-4 flex flex-1 items-center justify-center gap-2">
              <span className="text-[12px] font-[500]">Date</span>
              <ChevronDown />
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
            <div className=" mb-4 flex flex-1 justify-center">
              <span className="text-[12px] font-[500]">Details</span>
            </div>
          </div>
          {payins.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-row justify-between border-b border-passes-dark-200"
            >
              <div className="flex h-[72px] flex-1 items-center justify-center">
                <span className="text-[14px] font-[700] text-passes-pink-100">
                  {transaction.transactionHash ?? "N/A"}
                </span>
              </div>
              <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
                <span className="text-[12px] font-[500]">
                  {transaction?.card?.name ?? "N/A"}
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
                  {transaction?.payinMethod?.method ?? "N/A"}
                </span>
              </div>
              <div className="flex h-[72px] flex-1 items-center justify-center">
                <div className="mt-1 mr-1 rounded-full bg-[#667085] p-1" />
                <span className="text-[12px] font-[500]">
                  {transaction.payinStatus ?? "N/A"}
                </span>
              </div>
              <div className="flex h-[72px] flex-1 items-center justify-center">
                <span className="text-[14px] font-[700] text-passes-pink-100">
                  {transaction.address ?? "N/A"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-row justify-between px-10">
          <span className="text-[14px] font-[500] text-[#646464]">{`Page ${
            currentPage + 1
          } of ${totalPages}`}</span>
          <div className="flex gap-4">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="rounded-[6px] bg-[#322F33] py-[9px] px-[17px] hover:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="rounded-[6px] bg-[#322F33] py-[9px] px-[17px] hover:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentSettings
