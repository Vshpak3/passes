import {
  CreateCreatorSettingsRequestDtoPayoutFrequencyEnum,
  CreatorSettingsApi,
  PaymentApi
} from "@passes/api-client"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { Button, FormInput, PassesPinkButton } from "src/components/atoms"
import { PastTransactions } from "src/components/organisms"
import { wrapApi } from "src/helpers"
import { useLocalStorage, useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

import BankIcon from "../../icons/bank-icon"
import AccountCard from "../payment/AccountCard"

const payoutFrequencyOptions = [
  {
    label: "Weekly",
    value: CreateCreatorSettingsRequestDtoPayoutFrequencyEnum.OneWeek
  },
  {
    label: "Biweekly",
    value: CreateCreatorSettingsRequestDtoPayoutFrequencyEnum.TwoWeeks
  }
]

const Payouts = () => {
  const router = useRouter()
  const { user, loading } = useUser()
  const [banks, setBanks] = useState([])
  const {
    register: register,
    // handleSubmit,
    getValues,
    setValue,
    formState: { errors }
  } = useForm({})

  const [defaultPayout, setDefaultPayout] = useState()
  const [accessToken] = useLocalStorage("access-token", "")

  const filteredDefaultPayout = banks.find(
    (bank) => bank.id === defaultPayout?.bankId
  )

  const onManualPayoutClick = async () => {
    const paymentApi = wrapApi(PaymentApi)
    try {
      await paymentApi.paymentPayout()
    } catch (error) {
      toast.error(error)
    }
  }

  const handleChange = async () => {
    try {
      const creatorSettingsApi = wrapApi(CreatorSettingsApi)
      const payoutFrequency = getValues("payoutFrequency")

      await creatorSettingsApi.creatorSettingsUpdate({
        updateCreatorSettingsRequestDto: {
          payoutFrequency
        },
        headers: {
          Authorization: "Bearer " + accessToken
          // "Content-Type": "application/json"
        }
      })
    } catch (error) {
      console.log("🚀 ~ file: payouts.js ~ line 90 ~ error", error)
      // setCreatorSettings({
      //   minimumTipAmount: "90000.00",
      //   payoutFrequency:
      //     CreateCreatorSettingsRequestDtoPayoutFrequencyEnum.TwoWeeks
      // })
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
        toast.error(error)
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

  const getAutomaticPayoutSchedule = useCallback(
    async (creatorSettingsApi) => {
      try {
        await creatorSettingsApi.creatorSettingsFind({
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        })
      } catch (error) {
        console.log(error)
      }
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
      const creatorSettingsApi = new CreatorSettingsApi()
      await getBanks(paymentApi)
      await getDefaultPayout(paymentApi)
      await getAutomaticPayoutSchedule(creatorSettingsApi)
    }
    fetchData()
  }, [
    router,
    user,
    loading,
    getBanks,
    getDefaultPayout,
    getAutomaticPayoutSchedule
  ])
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
              Your earnings balance must be at least $25 to request a payout
            </span>
            <div className="flex w-full flex-col justify-around gap-4 lg:flex-row">
              <div className="flex w-full flex-row items-center justify-between gap-x-4">
                <div>
                  <span className="text-sm text-[#ffff]/70">Auto payouts</span>

                  <FormInput
                    register={register}
                    type="select"
                    name="payoutFrequency"
                    selectOptions={payoutFrequencyOptions}
                    errors={errors}
                    onChange={(e) => {
                      setValue("payoutFrequency", e.target.value)
                      handleChange()
                    }}
                    // handleChange={handleChange}
                    className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
                  />
                </div>
                <div className="w-[222px]">
                  {/* Button needs to check button $25 more or less and be disabled if  */}
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
            Default Payout Method
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
      <PastTransactions />
    </div>
  )
}
export default withPageLayout(Payouts)
