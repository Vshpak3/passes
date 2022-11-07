import {
  PaymentApi,
  PayoutMethodDtoMethodEnum,
  UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum
} from "@passes/api-client"
import classNames from "classnames"
import Link from "next/link"
import ClockIcon from "public/icons/alarm.svg"
import ChevronDown from "public/icons/chevron-down.svg"
import { useCallback, useRef, useState } from "react"

import { PassesPinkButton } from "src/components/atoms/Button"
import { errorMessage } from "src/helpers/error"
import {
  PayoutFrequencyEnum,
  useCreatorSettings
} from "src/hooks/settings/useCreatorSettings"
import { useCreatorBalance } from "src/hooks/useAnalytics"
import { useOnClickOutside } from "src/hooks/useOnClickOutside"
import { usePayoutMethod } from "src/hooks/usePayoutMethod"

const PAYOUT_FREQUENCY_OPTIONS: PayoutFrequencyOption[] = [
  {
    label: "4 weeks",
    value: UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum.FourWeeks
  },
  {
    label: "2 weeks",
    value: UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum.TwoWeeks
  },
  {
    label: "1 week",
    value: UpdateCreatorSettingsRequestDtoPayoutFrequencyEnum.OneWeek
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
  const { defaultPayoutMethod, defaultBank, defaultWallet } = usePayoutMethod()
  const { creatorSettings, updateCreatorSettings } = useCreatorSettings()
  const { userBalance } = useCreatorBalance()

  const onManualPayoutClick = useCallback(async () => {
    const api = new PaymentApi()
    try {
      await api.payout()
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }, [])

  const [showOptions, setShowOptions] = useState(false)
  const menuEl = useRef(null)

  useOnClickOutside(menuEl, () => setShowOptions(false))

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <div className="text-[24px] font-[700]">Request Payouts</div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex min-w-[200px] flex-[0.2] flex-col items-center justify-center rounded-[15px] border border-passes-dark-200 bg-gradient-to-br from-[#1B141D]/50 to-[#441E25] p-5">
          <div className="mb-4 text-[16px] opacity-[50%]">
            Balance Available
          </div>
          <div className="text-[28px] font-[700]">
            ${userBalance?.amount.toFixed(2)}
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-[15px] text-[16px] font-[500] opacity-[0.5]">
            Your earnings balance must be at least $50.00 to request a payout.
            Payouts are at most once every 5 days.
          </div>
          <div className="rounded-[15px] border border-passes-dark-200 bg-passes-black p-5">
            <div className="mb-5 text-[16px] font-[700] opacity-[0.8]">
              Request payout manually OR set a schedule for auto payouts.
            </div>

            <div className="flex flex-col justify-center sm:flex-row sm:items-center sm:justify-between">
              <div className="text-label relative inline-block " ref={menuEl}>
                <div
                  className="flex cursor-pointer items-center justify-between rounded-[6px] border border-passes-dark-200 p-2.5 focus:border-passes-blue-100 md:space-x-14"
                  onClick={() => setShowOptions(true)}
                  role="button"
                >
                  <div className="flex items-center gap-[5px]">
                    <ClockIcon className="h-[20px] w-[20px] fill-white" />
                    <span className="text-[16px] font-[400] opacity-[0.5]">
                      {creatorSettings
                        ? PAYOUT_FREQUENCY_OPTIONS.filter(
                            (option) =>
                              option.value === creatorSettings?.payoutFrequency
                          )[0].label
                        : "None"}
                    </span>
                  </div>
                  <ChevronDown />
                </div>
                {showOptions && (
                  <ul className="absolute z-10 w-full translate-y-1.5 space-y-2.5 rounded-md border border-passes-dark-200 bg-passes-black py-2.5 px-3">
                    {PAYOUT_FREQUENCY_OPTIONS.map(({ value, label }, i) => (
                      <li
                        className={classNames(
                          "cursor-pointer",
                          i !== PAYOUT_FREQUENCY_OPTIONS.length - 1
                            ? "border-b border-passes-dark-200 pb-2.5"
                            : ""
                        )}
                        key={value}
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
                className="ml-2 flex w-[215px] "
                name="Request Payment"
                onClick={onManualPayoutClick}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full text-[24px] font-[700]">Payout Destination</div>
      <div className="flex w-full flex-col gap-5 md:flex-row">
        <div className="flex w-full flex-col gap-[20px] rounded-[15px] border border-passes-dark-200 bg-[#1b141d80] p-5">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-[10px]">
              <span className="text-[14px] font-[700]">
                Default Payout Method:
              </span>
              {defaultPayoutMethod?.method ===
                PayoutMethodDtoMethodEnum.None && (
                <span className="rounded-[56px] border border-[#322F33] bg-[#000] py-[6px] px-[16px] text-[16px] font-[500]">
                  None
                </span>
              )}
            </div>
            <div>
              <Link href="/settings/payout">
                <PassesPinkButton
                  className="ml-2 flex px-[18px]"
                  name="Manage Payment Method"
                />
              </Link>
            </div>
          </div>
          {defaultBank && (
            <div className="flex flex-row items-center gap-[10px]">
              <span>IDR / BCA</span>
              <span className="text-[14px] font-[700]">
                {defaultBank.circleId}
              </span>
              <span>Transfer Type</span>
              <span className="text-[14px] font-[700]">
                {defaultBank.status}
              </span>
              <span>Bank Country</span>
              <span className="text-[14px] font-[700]">
                {defaultBank.country}
              </span>
            </div>
          )}
          {defaultWallet && (
            <div className="flex flex-row items-center gap-[10px]">
              {/* <span className="rounded-[15px] bg-[#C943A8] p-[10px]">
                <svg
                  fill="none"
                  height="18"
                  viewBox="0 0 22 18"
                  width="22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 6.5V4.2C19 3.0799 19 2.51984 18.782 2.09202C18.5903 1.7157 18.2843 1.40974 17.908 1.21799C17.4802 1 16.9201 1 15.8 1H4.2C3.0799 1 2.51984 1 2.09202 1.21799C1.7157 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.0799 1 4.2V13.8C1 14.9201 1 15.4802 1.21799 15.908C1.40973 16.2843 1.71569 16.5903 2.09202 16.782C2.51984 17 3.07989 17 4.2 17L15.8 17C16.9201 17 17.4802 17 17.908 16.782C18.2843 16.5903 18.5903 16.2843 18.782 15.908C19 15.4802 19 14.9201 19 13.8V11.5M14 9C14 8.53535 14 8.30302 14.0384 8.10982C14.1962 7.31644 14.8164 6.69624 15.6098 6.53843C15.803 6.5 16.0353 6.5 16.5 6.5H18.5C18.9647 6.5 19.197 6.5 19.3902 6.53843C20.1836 6.69624 20.8038 7.31644 20.9616 8.10982C21 8.30302 21 8.53535 21 9C21 9.46466 21 9.69698 20.9616 9.89018C20.8038 10.6836 20.1836 11.3038 19.3902 11.4616C19.197 11.5 18.9647 11.5 18.5 11.5H16.5C16.0353 11.5 15.803 11.5 15.6098 11.4616C14.8164 11.3038 14.1962 10.6836 14.0384 9.89018C14 9.69698 14 9.46465 14 9Z"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.4"
                  />
                </svg>
              </span> */}
              <span className="text-[14px] font-[700]">Wallet address:</span>
              <span className="text-[14px] font-[700]">
                {defaultWallet.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
