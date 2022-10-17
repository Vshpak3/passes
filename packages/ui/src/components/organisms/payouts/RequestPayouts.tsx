import {
  CreatorStatsApi,
  PaymentApi,
  PayoutMethodDtoMethodEnum,
  UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum
} from "@passes/api-client"
import classNames from "classnames"
import { useRouter } from "next/router"
import ClockIcon from "public/icons/alarm.svg"
import ChevronDown from "public/icons/chevron-down-icon.svg"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { PassesPinkButton } from "src/components/atoms/Button"
import {
  PayoutFrequencyEnum,
  useCreatorSettings
} from "src/hooks/settings/useCreatorSettings"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { usePayoutMethod } from "src/hooks/usePayoutMethod"

const PAYOUT_FREQUENCY_OPTIONS: PayoutFrequencyOption[] = [
  {
    label: "Weekly",
    value: UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum.OneWeek
  },
  {
    label: "Biweekly",
    value: UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum.TwoWeeks
  },
  {
    label: "Manual Only",
    value: UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum.Manual
  }
]

type PayoutFrequencyOption = {
  value?: PayoutFrequencyEnum
  label: string
}

export const RequestPayouts = () => {
  const router = useRouter()
  const { defaultPayoutMethod, defaultBank, defaultWallet } = usePayoutMethod()
  const { creatorSettings, updateCreatorSettings } = useCreatorSettings()
  const [balance, setBalance] = useState(0)

  const fetchCreatorBalance = useCallback(async () => {
    const api = new CreatorStatsApi()
    const data = await api.getAvailableBalance()
    setBalance(data.amount ?? 0)
  }, [])

  const onManualPayoutClick = useCallback(async () => {
    const api = new PaymentApi()
    try {
      await api.payout()
    } catch (error: any) {
      toast.error(error)
    }
  }, [])

  useEffect(() => {
    fetchCreatorBalance()
  }, [fetchCreatorBalance])

  const [showOptions, setShowOptions] = useState(false)
  const menuEl = useRef(null)

  useOnClickOutside(menuEl, () => setShowOptions(false))

  return (
    <div>
      <div className="mb-5 text-[24px] font-[700]">Request Payouts</div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="min-w-[200px] flex-[0.2] rounded-[20px] border border-passes-dark-200 bg-gradient-to-br from-[#1B141D]/50 to-[#441E25] p-5">
          <div className="mb-4 text-[16px] opacity-[50%]">
            Balance Available
          </div>
          <div className="text-[28px] font-[700]">${balance.toFixed(2)}</div>
        </div>
        <div className=" ">
          <div className="mb-[15px] text-[16px] font-[500] opacity-[0.5]">
            Your earnings balance must be at least $25.00 to request a payout.
            <br />
            Payouts are at most once every 3 days.
          </div>
          <div className="rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-5">
            <div className="mb-5 text-[16px] font-[700] opacity-[0.8]">
              Request payout manually OR set a schedule for auto payouts.
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="text-label relative inline-block" ref={menuEl}>
                <div
                  role="button"
                  onClick={() => setShowOptions(true)}
                  className="flex w-[220px] cursor-pointer space-x-6 rounded-[6px] border border-passes-dark-200 p-2.5 focus:border-passes-blue-100 md:space-x-14"
                >
                  <ClockIcon className="h-[20px] w-[20px] fill-white" />
                  <span className="text-[16px] font-[400] opacity-[0.5]">
                    {creatorSettings
                      ? PAYOUT_FREQUENCY_OPTIONS.filter(
                          (option) =>
                            option.value === creatorSettings?.payoutFrequency
                        )[0].label
                      : "None"}
                  </span>
                  <ChevronDown />
                </div>
                {showOptions && (
                  <ul className="absolute z-10 w-full translate-y-1.5 space-y-2.5 rounded-md border border-passes-dark-200 bg-passes-dark-700 py-2.5 px-3">
                    {PAYOUT_FREQUENCY_OPTIONS.map(({ value, label }, i) => (
                      <li
                        key={value}
                        className={classNames(
                          "cursor-pointer",
                          i !== PAYOUT_FREQUENCY_OPTIONS.length - 1
                            ? "border-b border-passes-dark-200 pb-2.5"
                            : ""
                        )}
                        onClick={async () => {
                          await updateCreatorSettings(
                            {
                              payoutFrequency: value
                            },
                            "Successfully updated payout frequency"
                          )
                        }}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <PassesPinkButton
                className="ml-2 flex w-[215px]"
                name="Request Payment"
                onClick={() => onManualPayoutClick()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 text-[24px] font-[700]">Payout Destination</div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="min-w-[200px] flex-[0.2] rounded-[20px] border border-passes-dark-200 bg-gradient-to-br from-[#1B141D]/50 to-[#441E25] p-5">
          {defaultPayoutMethod?.method === PayoutMethodDtoMethodEnum.None && (
            <>
              <span className="text-[24px] font-[700]">None</span>
              <span className="text-[16px] font-[500]">Change in settings</span>
            </>
          )}
          {defaultBank && (
            <>
              <span className="text-[24px] font-[700]">
                {defaultBank.description.split(",")[0]}
              </span>
              <span className="text-[16px] font-[500]">
                {defaultBank.description.split(",")[1]}
              </span>
            </>
          )}
          {defaultWallet && (
            <>
              <span className="text-[24px] font-[700]">
                {defaultWallet.address}
              </span>
              <span className="text-[16px] font-[500]">
                {defaultWallet.chain}
              </span>
            </>
          )}
          <PassesPinkButton
            className="ml-2 flex w-[215px]"
            name="Change"
            onClick={() => router.push("/settings/payout")}
          />
        </div>
      </div>
    </div>
  )
}
