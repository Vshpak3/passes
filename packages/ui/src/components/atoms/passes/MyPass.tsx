import { PassHolderDto } from "@passes/api-client"
import UnlockLockIcon from "public/icons/profile-unlock-lock-icon.svg"
import { useEffect, useState } from "react"

import { classNames } from "../../../helpers"
import { PassTypeEnum } from "../../../hooks/useCreatePass"

interface IPassTileLabel {
  expiryDate: Date
  passType: string
  willExpireSoon: boolean
  onRenewal: () => void
}
interface IPassRenewalButton {
  onRenewal: () => void
}
interface ISelectPassFilter {
  setPassType: React.Dispatch<React.SetStateAction<string>>
}
interface IPassTileContent {
  stat: number
  title: string
  price?: number
}
interface IMyPassTile {
  passData: PassHolderDto
  isExpired?: boolean
}
type TComposePassOptions = {
  value: string
  label: string
  selected: boolean
}

function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1)
}

const PASS_OPTIONS = [
  {
    value: "all",
    label: "All Pass Types",
    selected: true
  },
  {
    value: PassTypeEnum.LIFETIME,
    label: "Lifetime Passes",
    selected: false
  },
  {
    value: PassTypeEnum.SUBSCRIPTION,
    label: "Subscription Passes",
    selected: false
  }
]
const ONE_MONTH = 2629746 * 1000

const PassRenewalButton = ({ onRenewal }: IPassRenewalButton) => (
  <button
    className="flex w-full items-center justify-center gap-[10px] rounded-[50px] border-none bg-passes-pink-100 py-[10px] text-base font-semibold text-white shadow-sm"
    value="renew-pass"
    onClick={onRenewal}
  >
    <UnlockLockIcon className="flex h-6 w-6" />
    Renew
  </button>
)

const SelectPassFilter = ({ setPassType }: ISelectPassFilter) => {
  function composePassOptions(option: TComposePassOptions) {
    const { value, selected, label } = option
    return (
      <option key={value} value={value} selected={selected}>
        {label}
      </option>
    )
  }

  return (
    <select
      onChange={(e) => setPassType(e.target.value)}
      className="mt-5 block w-[190px] appearance-none rounded-md border border-passes-gray-100 bg-black p-2 px-3 py-2 text-[24px] text-base text-sm font-bold text-white md:mt-0"
    >
      {PASS_OPTIONS.map(composePassOptions)}
    </select>
  )
}

const PassTileLabel = ({
  willExpireSoon,
  passType,
  expiryDate,
  onRenewal
}: IPassTileLabel) => {
  return willExpireSoon ? (
    <div className="align-items mx-1 justify-between text-[14px] md:flex">
      <div className="font-semibold text-[#767676]">
        {`Expires on ${expiryDate.toDateString().slice(4)}`}
      </div>
      <div
        className="cursor-pointer font-bold text-passes-pink-100"
        onClick={onRenewal}
      >
        Renew
      </div>
    </div>
  ) : (
    <div className="mx-1 text-[14px] font-semibold text-[#767676]">
      {capitalizeFirstLetter(passType)} Pass
    </div>
  )
}

const PassTileContent = ({ stat, title, price }: IPassTileContent) => {
  return (
    <div className="flex h-full flex-col items-start justify-between p-4 text-[#ffff]/90 md:p-6">
      <div className="align-items items-start justify-start">
        <div className="text-[18px] font-bold">{stat}</div>
        <div className="text-[12px] leading-6">Subscriber</div>
      </div>
      <div className="mt-2">
        <span className="text-[24px] font-bold leading-9 line-clamp-2">
          {title}
        </span>
      </div>
      <div className="mt-2">
        <span className="text-[16px] font-bold">{price?.toFixed(2)}</span>
        <span className="ml-2 text-[14px] font-light">/month</span>
      </div>
    </div>
  )
}

const MyPassTile = ({ passData, isExpired = false }: IMyPassTile) => {
  const [hasMounted, setHasMounted] = useState(false)
  const expiryInMilSeconds = Number(passData.expiresAt) * 1000
  const expiryDate = new Date(expiryInMilSeconds)

  const willExpireSoon = expiryInMilSeconds - Date.now() < ONE_MONTH

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <div className="col-span-1  w-full">
      <div
        className={classNames(
          willExpireSoon && !isExpired
            ? "bg-gradient-to-r from-[#375e6f] to-[#a9c2dd]"
            : "bg-gradient-to-r from-[#ff3cb1] to-[#3db9e5]",
          isExpired ? "opacity-70" : "opacity-100",
          "h-[200px] grow cursor-pointer rounded-xl drop-shadow transition-colors"
        )}
      >
        <PassTileContent stat={passData.totalSupply} title={passData.title} />
      </div>
      <div className="mt-[5px] md:mt-[10px]">
        {isExpired ? (
          <div className="align-items flex items-center justify-center">
            <PassRenewalButton onRenewal={() => console.log("on renewal")} />
          </div>
        ) : (
          <PassTileLabel
            onRenewal={() => console.log("on renewal")}
            expiryDate={expiryDate}
            willExpireSoon={willExpireSoon}
            passType={passData.type}
          />
        )}
      </div>
    </div>
  )
}

export { MyPassTile, SelectPassFilter }
