import { PassApi, PassHolderDto } from "@passes/api-client"
import classNames from "classnames"
import ms from "ms"
import EditIcon from "public/icons/edit-pass.svg"
import ArrowDown from "public/icons/post-audience-chevron-icon.svg"
import UnlockLockIcon from "public/icons/profile-unlock-lock-icon.svg"
import { FC, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import RenewPassModal from "src/components/organisms/payment/RenewPassModal"
import { useOnClickOutside, useUser } from "src/hooks"
import { PassTypeEnum } from "src/hooks/useCreatePass"

interface PassTileLabelProps {
  expiryDate: Date
  passType: string
  willExpireSoon: boolean
  onRenewal: () => void
}
interface PassRenewalButtonProps {
  onRenewal: () => void
}
interface SelectPassFilterProps {
  setPassType: React.Dispatch<React.SetStateAction<string>>
  passType: string
}
interface PassTileContentProps {
  stat: number
  title: string
  price?: number
}
interface MyPassTileProps {
  passData: PassHolderDto
  isExpired?: boolean
  isEdit?: boolean
  passOnEditHandler?: (value: PassHolderDto) => void
}
type TComposePassOptions = {
  value: string
  label: string
}

function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1)
}

const PASS_OPTIONS = [
  {
    value: "all",
    label: "All Pass Types"
  },
  {
    value: PassTypeEnum.LIFETIME,
    label: "Lifetime Passes"
  },
  {
    value: PassTypeEnum.SUBSCRIPTION,
    label: "Subscription Passes"
  }
]

const TAB_OPTIONS = [
  {
    value: PassTypeEnum.SUBSCRIPTION,
    label: "Subscription Passes"
  },
  {
    value: PassTypeEnum.LIFETIME,
    label: "Lifetime Passes"
  }
]

const ONE_MONTH = ms("30 days")

const PassRenewalButton: FC<PassRenewalButtonProps> = ({ onRenewal }) => (
  <button
    className="flex w-full items-center justify-center gap-[10px] rounded-[50px] border-none bg-passes-pink-100 py-[10px] text-base font-semibold text-white shadow-sm"
    value="renew-pass"
    onClick={onRenewal}
  >
    <UnlockLockIcon className="flex h-6 w-6" />
    Renew
  </button>
)

const SelectPassFilter: FC<SelectPassFilterProps> = ({
  setPassType,
  passType
}) => {
  const [showOptions, setShowOptions] = useState(false)
  const menuEl = useRef(null)

  const [selectedValue, setSelectedValue] =
    useState<TComposePassOptions | null>(null)
  const filteredOptions = PASS_OPTIONS.filter(
    ({ label }) => label !== selectedValue?.label
  )

  useEffect(() => {
    const [label] = PASS_OPTIONS.filter(({ value }) => value === passType)
    setSelectedValue(label)
    setShowOptions(false)
  }, [passType])

  useOnClickOutside(menuEl, () => setShowOptions(false))

  return (
    <div className="text-label relative inline-block" ref={menuEl}>
      <div
        role="button"
        onClick={() => setShowOptions(true)}
        className="flex w-[220px] cursor-pointer space-x-6 rounded-[6px] border border-passes-dark-200 p-2.5 focus:border-passes-blue-100 md:space-x-14"
      >
        <span>{selectedValue?.label}</span>
        <ArrowDown />
      </div>
      {showOptions && (
        <ul className="absolute z-10 w-full translate-y-1.5 space-y-2.5 rounded-md border border-passes-dark-200 bg-passes-dark-700 py-2.5 px-3">
          {filteredOptions.map(({ value, label }, i) => (
            <li
              key={value}
              className={classNames(
                "cursor-pointer",
                i !== filteredOptions.length - 1
                  ? "border-b border-passes-dark-200 pb-2.5"
                  : ""
              )}
              onClick={() => {
                setShowOptions(false)
                setPassType(value)
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const SelectPassTab: FC<SelectPassFilterProps> = ({
  setPassType,
  passType
}) => {
  const [selectedValue, setSelectedValue] = useState<TComposePassOptions>(
    TAB_OPTIONS[0]
  )

  useEffect(() => {
    const [label] = TAB_OPTIONS.filter(({ value }) => value === passType)
    setSelectedValue(label)
  }, [passType])

  useEffect(() => {
    setPassType(TAB_OPTIONS[0].value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    selectedValue && (
      <div
        className="
          z-[1]
          mt-[10px]
          box-border
          flex
          w-fit"
      >
        {TAB_OPTIONS.map(({ value, label }) => (
          <div
            className={classNames(
              selectedValue.label === label
                ? "" + "border-b-[3px] border-[#9C4DC1] px-[10px] text-white"
                : "px-[10px] text-grayDark-gray8",
              "block cursor-pointer justify-between pt-[10px] text-[16px] font-bold first:mr-[58px]"
            )}
            key={value}
          >
            <div
              onClick={() => setPassType(value)}
              className="flex w-full items-center pb-[10px]"
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    )
  )
}

const PassTileLabel = ({
  willExpireSoon,
  passType,
  expiryDate,
  onRenewal
}: PassTileLabelProps) => (
  <>
    {willExpireSoon ? (
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
    )}
  </>
)

const PassTileContent = ({ stat, title, price }: PassTileContentProps) => (
  <div className="flex h-full flex-col items-start justify-between p-4 text-[#ffff]/90 md:p-6">
    <div className="align-items items-start justify-start">
      <div className="text-[18px] font-bold">{stat}</div>
      <div className="text-[12px] leading-6">Subscriber</div>
    </div>
    <div className="mt-2">
      <span className="w-[180px] text-[24px] font-bold leading-9 line-clamp-2">
        {title}
      </span>
    </div>
    <div className="mt-2">
      <span className="text-[16px] font-bold">{price?.toFixed(2)}</span>
      <span className="ml-2 text-[14px] font-light">/month</span>
    </div>
  </div>
)

const MyPassTile = ({
  passData,
  isExpired = false,
  isEdit = false,
  passOnEditHandler
}: MyPassTileProps) => {
  const { user } = useUser()
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const expiryInMilSeconds = Number(passData.expiresAt)
  const expiryDate = new Date(expiryInMilSeconds)
  const dateNow = Date.now()

  const toggleRenewModal = () => setIsRenewModalOpen((prevState) => !prevState)

  const willExpireSoon =
    expiryInMilSeconds - dateNow < ONE_MONTH && expiryInMilSeconds > dateNow

  useEffect(() => {
    const api = new PassApi()
    api
      .getExternalPasses({
        getExternalPassesRequestDto: {
          creatorId: user?.id
        }
      })
      // .then(({ passes }) => setExternalPasses(passes))
      .catch(({ message }) => {
        console.error()
        toast(message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="col-span-1 w-full">
      {isEdit ? (
        <div
          className={classNames(
            "bg-pass-gradient bg-cover",
            "h-[200px] grow cursor-pointer rounded-xl drop-shadow transition-colors"
          )}
        >
          <PassTileContent
            stat={passData.totalSupply}
            title={passData.title}
            price={passData.price}
          />
          <div className="mt-[6px] flex justify-end">
            {passOnEditHandler && (
              <button
                onClick={() => passOnEditHandler(passData)}
                className="flex items-center"
              >
                <EditIcon />
                <span className="ml-[6px] inline text-[#C943A8]">
                  Edit Pass
                </span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div
            className={classNames(
              willExpireSoon && !isExpired
                ? "bg-gradient-to-r from-[#375e6f] to-[#a9c2dd]"
                : "bg-gradient-to-r from-[#ff3cb1] to-[#3db9e5]",
              isExpired ? "opacity-70" : "opacity-100",
              "h-[200px] grow cursor-pointer rounded-xl drop-shadow transition-colors"
            )}
          >
            <PassTileContent
              stat={passData.totalSupply}
              title={passData.title}
              price={passData.price}
            />
          </div>
          <div className="mt-[5px] md:mt-[10px]">
            {isExpired ? (
              <div className="align-items flex items-center justify-center">
                <PassRenewalButton onRenewal={toggleRenewModal} />
                <RenewPassModal
                  isOpen={isRenewModalOpen}
                  setOpen={setIsRenewModalOpen}
                  passHolder={passData}
                />
              </div>
            ) : (
              <PassTileLabel
                // TODO:
                // eslint-disable-next-line no-console
                onRenewal={() => console.log("on renewal")}
                expiryDate={expiryDate}
                willExpireSoon={willExpireSoon}
                passType={passData.type}
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export { MyPassTile, SelectPassFilter, SelectPassTab }
