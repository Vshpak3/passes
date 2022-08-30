import { PaymentApi } from "@passes/api-client"
import moment from "moment"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { Button, PassesPinkButton } from "src/components/atoms"
import { Popover } from "src/components/organisms"
import { classNames, wrapApi } from "src/helpers"
import { useLocalStorage, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

import BankIcon from "../../icons/bank-icon"
import AccountCard from "../payment/AccountCard"

// type TFormValues = {
//   title: string
//   description: string
//   imageUrl: string
//   type: string
//   price: string
//   totalSupply: string
// }

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
    payoutDate: "2021-07-22",
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
    buyer: "Jonathan",
    payoutDate: "2022-07-22",
    description: "Watch me neigh neigh"
  },
  {
    transactionId: "ACA54752",
    buyer: "Rosa",
    payoutDate: "2022-08-21",
    description: "Watch me neigh neigh"
  }
]

const Payouts = () => {
  const router = useRouter()
  const [banks, setBanks] = useState([])
  const [defaultPayout, setDefaultPayout] = useState()
  const [accessToken] = useLocalStorage("access-token", "")

  const [selectedMonth, setSelectedMonth] = useState(
    moment(new Date()).startOf("month").format("MMMM YYYY")
  )
  const { user, loading } = useUser()
  const filteredDefaultPayout = banks.find(
    (bank) => bank.id === defaultPayout?.bankId
  )
  console.log(filteredDefaultPayout)
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

  const datesInRange = (transactions) => {
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

  const onManualPayoutClick = async () => {
    const paymentApi = wrapApi(PaymentApi)
    try {
      await paymentApi.paymentPayout()
    } catch (error) {
      console.log(error)
    }
  }

  const getDefaultPayout = useCallback(
    async (api) => {
      try {
        setDefaultPayout(
          await api.paymentGetDefaultPayoutMethod({
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json"
            }
          })
        )
      } catch (error) {
        setDefaultPayout(undefined)
      }
    },
    [accessToken]
  )
  const getBanks = useCallback(
    async (paymentApi) => {
      setBanks(
        (
          await paymentApi.paymentGetCircleBanks({
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json"
            }
          })
        ).banks
      )
    },
    [accessToken]
  )

  useEffect(() => {
    if (!router.isReady || loading) {
      console.log("r2")
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

  return (
    <div className="mx-auto -mt-[160px] grid w-full grid-cols-10 gap-5 px-4 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0  sidebar-collapse:w-[1000px]">
      <div className="col-span-10 w-full">
        <div className="my-4 flex gap-x-4">
          <span className="text-[24px] font-bold text-[#ffff]/90">
            Request Payouts
          </span>
        </div>
      </div>
      <div className="col-span-10 h-[110px] w-full space-y-6 lg:col-span-3 lg:min-h-[178px] lg:max-w-[280px]">
        <div className="mb-16 text-base font-medium leading-[19px] lg:h-full">
          <div className="flex flex-col items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px] md:items-center  lg:h-full ">
            <span className="self-start text-base font-bold text-[#ffff]/90">
              Balance available
            </span>
            <span className="self-start text-base font-bold text-[#ffff]/90">
              $2,001.89
            </span>
            <span className="self-start text-base font-bold text-[#ffff]/90">
              Request payout {"   >   "}
            </span>
          </div>
        </div>
      </div>
      <div className="col-span-10 w-full md:space-y-6 lg:col-span-7 lg:min-h-[178px] lg:max-w-[680px]">
        <div className="mb-16 text-base font-medium leading-[19px] lg:h-full">
          <div className="flex flex-col justify-around rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px] lg:h-full">
            <span className="text-sm text-[#ffff]/70 lg:self-start">
              Your earnings balance must not below $25.00 which is the minimum
              to request a payout.
            </span>
            <div className="flex w-full flex-col justify-around gap-4 lg:flex-row">
              <div className="flex w-full flex-row items-center justify-end gap-x-4">
                <div className="w-[222px]">
                  <PassesPinkButton
                    name="Request Payment"
                    onClick={() => onManualPayoutClick()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-10 w-full">
        <div className="my-4 flex flex-row justify-between gap-x-4">
          <span className="text-[24px] font-bold text-[#ffff]/90">
            Bank Account
          </span>
          <Button
            variant="purple"
            icon={<BankIcon width={25} height={25} />}
            onClick={() => router.push("/payment/default-payout-method")}
          >
            Manage Bank
          </Button>
        </div>
      </div>
      <div className="col-span-10 w-full md:space-y-6">
        <div className="mb-16 text-base font-medium leading-[19px] lg:h-full">
          {filteredDefaultPayout && (
            <AccountCard account={filteredDefaultPayout} isDefault={true} />
          )}
        </div>
      </div>
      <div className="col-span-10 w-full">
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
          {datesInRange(payoutTransaction).map((transaction, index) => (
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
        </div>
      </div>
    </div>
  )
}
export default withPageLayout(Payouts)
