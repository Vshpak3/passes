import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { PayinDto, PaymentApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { Tab } from "src/components/pages/settings/Tab"
import { useUser } from "src/hooks/useUser"
import { ChevronDown } from "src/icons/chevron-down"

const PAGE_SIZE = 7

const PaymentHistory = () => {
  const [payins, setPayins] = useState<PayinDto[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)

  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])

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

  return (
    <>
      <Tab withBack title="Payment History" />

      <div className="mb-5 flex w-full flex-col gap-4">
        <div className="flex flex-row items-center justify-between rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-4">
          <span className="text-[16px] font-[700]">
            Payments Transaction History
          </span>
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
                  {"****" + transaction?.card?.fourDigits ?? "N/A"}
                </span>
              </div>
              <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
                <span className="text-[12px] font-[500]">
                  {new Date(transaction.createdAt).toString() ?? "N/A"}
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

export default PaymentHistory // eslint-disable-line import/no-default-export
