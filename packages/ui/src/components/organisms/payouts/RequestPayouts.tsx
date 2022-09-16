import { Menu, Transition } from "@headlessui/react"
import {
  CreatorSettingsApi,
  PaymentApi,
  UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum
} from "@passes/api-client"
import ClockIcon from "public/icons/alarm.svg"
import ChevronDown from "public/icons/chevron-down-icon.svg"
import { Fragment, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { wrapApi } from "../../../helpers"
import { FormInput, PassesPinkButton } from "../../atoms"

const payoutFrequencyOptions = [
  {
    label: "Weekly",
    value: UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum.OneWeek
  },
  {
    label: "Biweekly",
    value: UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum.TwoWeeks
  }
]

const RequestPayouts = () => {
  const {
    register,
    getValues,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const fetchAutomaticPayoutSchedule = useCallback(async () => {
    const api = wrapApi(CreatorSettingsApi)
    const data = await api.getCreatorSettings()
    console.log(data, "fetchAutomaticPayoutSchedule")
  }, [])

  const onManualPayoutClick = useCallback(async () => {
    const api = wrapApi(PaymentApi)
    try {
      await api.payout()
    } catch (error: any) {
      toast(error)
    }
  }, [])

  useEffect(() => {
    fetchAutomaticPayoutSchedule()
  }, [fetchAutomaticPayoutSchedule])

  const onScheduleSave = useCallback(async () => {
    const api = wrapApi(CreatorSettingsApi)
    try {
      const data = await api.updateCreatorSettings({
        updateCreatorSettingsRequestDto: {
          payoutFrequency: getValues().payoutFrequency
        }
      })
      console.log(data, "fetchAutomaticPayoutSchedule")
    } catch (error: any) {
      toast(error)
    }
  }, [getValues])

  return (
    <div>
      <div className="mb-5 text-[24px] font-[700]">Request Payouts</div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex-[0.2] rounded-[20px] border border-passes-dark-200 bg-gradient-to-br from-[#1B141D]/50  to-[#441E25] p-5">
          <div className="mb-4 text-[16px] opacity-[50%]">
            Balance Available
          </div>
          <div className="text-[28px] font-[700]">$2,001.89</div>
        </div>
        <div className=" ">
          <div className="mb-[15px] text-[16px] font-[500] opacity-[0.5]">
            Your earnings balance must be at least $25.00 to request a payout.
          </div>
          <div className="rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-5">
            <div className="mb-5 text-[16px] font-[700] opacity-[0.8]">
              Request payout mannually or schedule an auto payout.
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <FormInput
                register={register}
                type="checkbox"
                name="payoutCheckbox"
                errors={errors}
                className="h-[20px] w-[20px] cursor-pointer bg-transparent"
              />

              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button disabled={!watch("payoutCheckbox")}>
                  <div className="flex h-[45px] cursor-pointer flex-row items-center gap-4 rounded-[6px] border border-passes-dark-200 bg-transparent p-4 text-[#ffff]/90">
                    <ClockIcon className="h-[20px] w-[20px] fill-white" />
                    <span className="text-[16px] font-[400] opacity-[0.5]">
                      Create Payout Schedule
                    </span>
                    <ChevronDown />
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="absolute right-0 z-10 mt-2 flex origin-top-right flex-col items-center justify-center gap-4 rounded-[20px] border border-passes-dark-100 bg-black p-4 text-center shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <span className="text-[16px] font-[500]">
                      Create Payout Schedule
                    </span>
                    <span className="text-[14px] font-[400] text-passes-secondary-color">
                      Please choose frequency of the payouts.
                    </span>
                    <FormInput
                      register={register}
                      type="select"
                      name="payoutFrequency"
                      selectOptions={payoutFrequencyOptions}
                      errors={errors}
                      className="m-0 mt-2 w-[223px] border-passes-dark-200 bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
                    />
                    <PassesPinkButton
                      className="w-[223px]"
                      name="Save"
                      onClick={handleSubmit(onScheduleSave)}
                    />
                  </Menu.Items>
                </Transition>
              </Menu>

              <PassesPinkButton
                className="ml-2 flex w-[215px]"
                name="Request Payment"
                onClick={() => onManualPayoutClick()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestPayouts
