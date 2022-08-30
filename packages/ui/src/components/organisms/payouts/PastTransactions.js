import { PaymentApi } from "@passes/api-client"
import moment from "moment"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { Button } from "src/components/atoms"
import { Popover } from "src/components/organisms"
import { classNames, wrapApi } from "src/helpers"
import { useLocalStorage, useUser } from "src/hooks"

const PAGE_SIZE = 5

function getMonths(startDate, endDate) {
  const startMoment = moment(startDate).startOf("month")
  const endMoment = moment(endDate).startOf("month")
  const arr = []
  do {
    arr.push(startMoment.format("MMMM YYYY"))
  } while (startMoment.add(1, "month").diff(endMoment) <= 0)
  return arr
}
const arr = getMonths(new Date("2020-07-25"), new Date()).reverse()

const payoutTransaction = [
  {
    transactionId: "ACA5474",
    buyer: "Olimber",
    payoutDate: "2022-07-22",
    description: "i hate everyone"
  },
  {
    transactionId: "ACA54749",
    buyer: "Connor",
    payoutDate: "2022-07-22",
    description: "Never trust a wizard"
  },
  {
    transactionId: "ACA54750",
    buyer: "Michael",
    payoutDate: "2022-07-22",
    description: "I'm an engineer too"
  },
  {
    transactionId: "ACA54751",
    buyer: "David",
    payoutDate: "2022-07-21",
    description: "Super Sadge"
  },
  {
    transactionId: "ACA54751",
    buyer: "Lee",
    payoutDate: "2022-07-20",
    description: "Sadge"
  },
  {
    transactionId: "ACA54751",
    buyer: "Jonathan",
    payoutDate: "2022-07-22",
    description: "Watch me neigh neigh"
  },
  {
    transactionId: "ACA54752",
    buyer: "Woj",
    payoutDate: "2022-07-17",
    description: "Watch me neigh neigh"
  }
]
const PastTransactions = () => {
  const [payins, setPayins] = useState()
  const [count, setCount] = useState(0)
  const { user, loading } = useUser()
  const router = useRouter()
  const [page, setPage] = useLocalStorage("payment-page-number", 0)

  const [selectedMonth, setSelectedMonth] = useState(
    moment(new Date()).startOf("month").format("MMMM YYYY")
  )
  const selectedfullDate = new Date(selectedMonth)
  const firstDate = new Date(
    selectedfullDate.getFullYear(),
    selectedfullDate.getMonth(),
    1
  )
  const lastDate = new Date(
    selectedfullDate.getFullYear(),
    selectedfullDate.getMonth() + 1,
    0
  )
  const firstDay = firstDate.getDate()

  const lastDay = lastDate.getDate()
  const year = selectedfullDate.getFullYear()

  // purely for demo as BE takes care of pagination
  const currentTsxData = useMemo(() => {
    const firstPageIndex = page * PAGE_SIZE
    console.log("firstpgeagendex", firstPageIndex)
    const lastPageIndex = firstPageIndex + PAGE_SIZE
    console.log("lastpageindex  ", lastPageIndex)
    console.log(
      "sliceanddice",
      payoutTransaction.slice(firstPageIndex, lastPageIndex)
    )
    return payoutTransaction.slice(firstPageIndex, lastPageIndex)
  }, [page])

  console.log(currentTsxData)

  const datesInRange = (transactions) => {
    console.log(transactions)
    const tempArray = []
    for (let i = 0; i < transactions.length; i++) {
      if (
        new Date(transactions[i].payoutDate) > firstDate &&
        new Date(transactions[i].payoutDate) < lastDate
      ) {
        tempArray.push(transactions[i])
      }
    }
    return tempArray
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }

    if (!user) {
      router.push("/login")
    }
    console.log(page)
    const fetchData = async () => {
      const paymentApi = wrapApi(PaymentApi)
      const payinListResponse = await paymentApi.paymentGetPayins({
        payinListRequestDto: { offset: PAGE_SIZE * page, limit: PAGE_SIZE }
      })
      console.log(payoutTransaction.slice(page, page * PAGE_SIZE))
      // uses dummy data if payin is empty
      setPayins(
        payinListResponse.payins.length !== 0
          ? payinListResponse.payins
          : payoutTransaction
      )
      setCount(
        payinListResponse.count !== 0
          ? payinListResponse.count
          : payoutTransaction.length
      )
    }
    fetchData()
  }, [router, user, loading, page, payins])
  if (!payins) return null
  return (
    <div className="col-span-10 mb-24 w-full">
      <div className="my-4 flex flex-row justify-between gap-x-4">
        <div className="flex flex-col gap-4">
          <span className="text-[24px] font-bold text-[#ffff]/90">
            Past Transactions Last 30 Days
          </span>
          <Popover
            trigger={
              <div>
                <span className="text-[#ffff]/90">{`${selectedMonth} ${firstDay}, ${year} - ${selectedMonth} ${lastDay}, ${year} v`}</span>
              </div>
            }
            triggerClassName="text-left"
            popoverClassName="border border-[#ffffff]/10 bg-[#1b141d] text-white/70 max-h-[200px]"
          >
            {arr.map((month) => (
              <div
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={classNames(
                  "py-1 pl-4 hover:bg-[#2a242b]",
                  month === selectedMonth && "bg-[#39353c]"
                )}
              >
                <span>{month}</span>
              </div>
            ))}
          </Popover>
        </div>
        <Button variant="purple">Report payment</Button>
      </div>
      <div className="flex">
        <div className="basis-[21%]">
          <span className="text-[#ffff]/90">Transaction ID</span>
        </div>
        <div className="basis-[21%]">
          <span className="text-[#ffff]/90">Buyer</span>
        </div>
        <div className="basis-[21%]">
          <span className="text-[#ffff]/90">Date</span>
        </div>
        <div className="basis-[21%]">
          <span className="text-[#ffff]/90">Description</span>
        </div>
      </div>
      <div className="">
        {datesInRange(currentTsxData).map((transaction, index) => (
          <div
            key={transaction.buyer}
            className={index % 2 === 0 ? "py-2" : "bg-[#ffff]/30 py-2"}
          >
            <div className="flex flex-wrap">
              <div className="basis-[21%]">
                <span className="pl-4 text-[#ffff]/90">
                  {transaction.transactionId}
                </span>
              </div>
              <div className="basis-[21%]">
                <span className="text-[#ffff]/90">{transaction.buyer}</span>
              </div>
              <div className="basis-[21%]">
                <span className="text-[#ffff]/90">
                  {transaction.payoutDate}
                </span>
              </div>
              <div className="basis-[35%]">
                <span className="text-[#ffff]/90">
                  {transaction.description}
                </span>
              </div>
            </div>
          </div>
        ))}
        {Array.from({ length: Math.ceil(count / PAGE_SIZE) }).map((_, i) => {
          return (
            <button
              key={i}
              onClick={() => {
                setPage(i)
              }}
              className="m-2"
            >
              <span className="text-[#ffff]">{i + 1}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PastTransactions
