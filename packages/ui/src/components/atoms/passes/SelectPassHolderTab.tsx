import { PassDtoTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import { FC } from "react"

interface PassHolderFilterOption {
  passType: PassDtoTypeEnum
  expired: boolean | undefined
  label: string
}

const PASS_HOLDER_TAB_OPTIONS: PassHolderFilterOption[] = [
  {
    passType: PassDtoTypeEnum.Subscription,
    expired: false,
    label: "Subscriptions"
  },
  {
    passType: PassDtoTypeEnum.Lifetime,
    expired: undefined,
    label: "Lifetime Memberships"
  },
  {
    passType: PassDtoTypeEnum.Subscription,
    expired: true,
    label: "Expired Subscriptions"
  }
]

interface SelectPassHolderTabProps {
  setPassType: React.Dispatch<React.SetStateAction<PassDtoTypeEnum>>
  passType?: PassDtoTypeEnum
  setExpired: React.Dispatch<React.SetStateAction<boolean | undefined>>
  expired?: boolean
}

export const SelectPassHolderTab: FC<SelectPassHolderTabProps> = ({
  setPassType,
  passType,
  setExpired,
  expired
}) => {
  return (
    <div className="z-[1] mt-[10px] box-border flex w-full">
      {PASS_HOLDER_TAB_OPTIONS.map((option) => (
        <div
          className={classNames(
            option.passType === passType && expired === option.expired
              ? "border-b-[3px] border-passes-primary-color text-white"
              : "border-b-[3px] border-b-transparent text-grayDark-gray8 hover:border-passes-primary-color hover:text-white/80",
            "flex cursor-pointer flex-row justify-between px-[8px] text-center text-[12px] font-bold sm:px-[30px] sm:pb-[10px] sm:text-[16px]"
          )}
          key={option.label}
        >
          <div
            className="flex w-full items-center pb-[10px]"
            onClick={() => {
              setPassType(option.passType)
              setExpired(option.expired)
            }}
          >
            {option.label}
          </div>
        </div>
      ))}
    </div>
  )
}
