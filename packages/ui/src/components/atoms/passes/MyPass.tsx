import { PassApi, PassDto, PassHolderDto } from "@passes/api-client"
import EditIcon from "public/icons/edit-pass.svg"
import ArrowDown from "public/icons/post-audience-chevron-icon.svg"
import UnlockLockIcon from "public/icons/profile-unlock-lock-icon.svg"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import RenewModal from "src/components/organisms/RenewModal"
import { classNames } from "src/helpers"
import { useUser } from "src/hooks"
import { PassTypeEnum } from "src/hooks/useCreatePass"

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
  passType: string
}
interface IPassTileContent {
  stat: number
  title: string
  price?: number
}
interface IMyPassTile {
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

const SelectPassFilter = ({ setPassType, passType }: ISelectPassFilter) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [selectedValue, setSelectedValue] =
    useState<TComposePassOptions | null>(null)
  const filteredOptions = PASS_OPTIONS.filter(
    ({ label }) => label !== selectedValue?.label
  )

  const isSelectOpenToggle = () => setIsSelectOpen((prevState) => !prevState)

  useEffect(() => {
    const [label] = PASS_OPTIONS.filter(({ value }) => value === passType)
    setSelectedValue(label)
    setIsSelectOpen(false)
  }, [passType])

  return (
    <div
      className="relative text-[24px]
        text-base
        text-sm
        font-bold
        text-white"
    >
      <input
        value={selectedValue?.label}
        onClick={isSelectOpenToggle}
        readOnly
        className="
          relative
          block
          h-[45px]
          w-[207px]
          cursor-pointer
          rounded-md
          border
          border-passes-gray-100
          bg-black
          p-[10px]
          text-[16px]
          outline-none
          md:mt-0"
      />
      <div
        className="
          absolute
          top-[50%]
          right-[16px]
          translate-y-[-50%]
          cursor-pointer"
      >
        <ArrowDown />
      </div>
      {isSelectOpen && (
        <div
          className="
          absolute
          top-[100%]
          right-0
          z-[1]
          mt-[10px]
          box-border
          w-full
          rounded-[6px]
          border
          border-[#34343A60]
          bg-[#100C11]
          px-[25px]
          pt-[6px]"
        >
          {filteredOptions.map(({ value, label }) => (
            <div
              className="
                block
                flex
                cursor-pointer
                justify-between
                pt-[10px]
                text-left
                text-[16px]
                last:border-t
                last:border-passes-gray-100"
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
      )}
    </div>
  )
}

const PassTileLabel = ({
  willExpireSoon,
  passType,
  expiryDate,
  onRenewal
}: IPassTileLabel) => (
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

const PassTileContent = ({ stat, title, price }: IPassTileContent) => (
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
}: IMyPassTile) => {
  const { user } = useUser()
  const [hasMounted, setHasMounted] = useState(false)
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const [externalPasses, setExternalPasses] = useState<PassDto[]>([])
  const expiryInMilSeconds = Number(passData.expiresAt)
  const expiryDate = new Date(expiryInMilSeconds)
  const dateNow = Date.now()

  const toggleRenewModal = () => setIsRenewModalOpen((prevState) => !prevState)

  const willExpireSoon =
    expiryInMilSeconds - dateNow < ONE_MONTH && expiryInMilSeconds > dateNow

  useEffect(() => {
    setHasMounted(true)
    const api = new PassApi()
    api
      .getExternalPasses({
        getExternalPassesRequestDto: {
          creatorId: user?.id
        }
      })
      .then(({ passes }) => setExternalPasses(passes))
      .catch(({ message }) => {
        console.error()
        toast(message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <div className="col-span-1  w-full">
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
                <RenewModal
                  isOpen={isRenewModalOpen}
                  setOpen={setIsRenewModalOpen}
                  passInfo={passData}
                  externalPasses={externalPasses}
                />
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
        </>
      )}
    </div>
  )
}

export { MyPassTile, SelectPassFilter }
