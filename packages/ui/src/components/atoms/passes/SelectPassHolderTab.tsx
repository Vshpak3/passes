import { PassDtoTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import { FC } from "react"

const PASS_HOLDER_TAB_OPTIONS: PassHolderFilterOption[] = [
  {
    passType: PassDtoTypeEnum.Subscription,
    expired: false,
    label: "Subscription (Active)"
  },
  {
    passType: PassDtoTypeEnum.Lifetime,
    label: "Lifetime"
  },
  {
    passType: PassDtoTypeEnum.Subscription,
    expired: true,
    label: "Subscription (Expired)"
  }
]

type PassHolderFilterOption = {
  passType: PassDtoTypeEnum
  expired?: boolean
  label: string
}

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
    <div
      className="
          z-[1]
          mt-[10px]
          box-border
          flex
          w-fit"
    >
      {PASS_HOLDER_TAB_OPTIONS.map((option) => (
        <div
          className={classNames(
            option.passType === passType && expired === option.expired
              ? "" + "border-b-[3px] border-[#9C4DC1] px-[10px] text-white"
              : "px-[10px] text-grayDark-gray8",
            "block cursor-pointer justify-between pt-[10px] text-[16px] font-bold first:mr-[58px]"
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
