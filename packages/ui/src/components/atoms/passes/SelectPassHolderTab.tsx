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
    <div className="z-[1] mt-[10px] box-border flex w-fit gap-[30px] border-b border-b-[#2C282D]">
      {PASS_HOLDER_TAB_OPTIONS.map((option) => (
        <div
          className={classNames(
            option.passType === passType && expired === option.expired
              ? "border-b-[3px] border-[#9C4DC1] text-white"
              : "px-[10px] text-grayDark-gray8",
            "flex cursor-pointer  flex-row justify-between px-[30px] pb-[10px] text-[16px] font-bold"
          )}
          key={option.label}
        >
          <div
            onClick={() => {
              setPassType(option.passType)
              setExpired(option.expired)
            }}
            className="flex w-full items-center pb-[10px]"
          >
            {option.label}
          </div>
        </div>
      ))}
    </div>
  )
}
