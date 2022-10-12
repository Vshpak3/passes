import { PassHolderDto } from "@passes/api-client"
import classNames from "classnames"
import UnlockLockIcon from "public/icons/profile-unlock-lock-icon.svg"
import { FC, useState } from "react"
import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { RenewPassModal } from "src/components/organisms/payment/RenewPassModal"

interface PassRenewalButtonProps {
  onRenewal: () => void
}
interface PassHoldingTileProps {
  passHolder: PassHolderDto
}

function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1)
}

export const PassRenewalButton: FC<PassRenewalButtonProps> = ({
  onRenewal
}) => (
  <button
    className="flex w-full items-center justify-center gap-[10px] rounded-[50px] border-none bg-passes-pink-100 py-[10px] text-base font-semibold text-white shadow-sm"
    value="renew-pass"
    onClick={onRenewal}
  >
    <UnlockLockIcon className="flex h-6 w-6" />
    Renew
  </button>
)

export const PassHoldingTile: FC<PassHoldingTileProps> = ({ passHolder }) => {
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const now = Date.now()

  const toggleRenewModal = () => setIsRenewModalOpen((prevState) => !prevState)

  return (
    <div className="col-span-1 w-full">
      <PassMedia
        passId={passHolder.passId}
        passHolderId={passHolder.passHolderId}
      />
      <div
        className={classNames(
          passHolder.expiresAt && passHolder.expiresAt.valueOf() <= now
            ? "opacity-70"
            : "opacity-100",
          "h-[200px] grow cursor-pointer rounded-xl drop-shadow transition-colors"
        )}
      >
        <div className="flex h-full flex-col items-start justify-between p-4 text-[#ffff]/90 md:p-6">
          <div className="align-items items-start justify-start">
            <div className="text-[12px] leading-6">Subscriber</div>
          </div>
          <div className="mt-2">
            <span className="w-[180px] text-[24px] font-bold leading-9 line-clamp-2">
              {passHolder.title}
            </span>
          </div>
          <div className="mt-2">
            <span className="text-[16px] font-bold">
              {passHolder.price?.toFixed(2)}
            </span>
            <span className="ml-2 text-[14px] font-light">/30 days</span>
          </div>
        </div>
      </div>
      <div className="mt-[5px] md:mt-[10px]">
        {passHolder.expiresAt && passHolder.expiresAt.valueOf() <= now ? (
          <div className="align-items flex items-center justify-center">
            <PassRenewalButton onRenewal={toggleRenewModal} />
            <RenewPassModal
              isOpen={isRenewModalOpen}
              setOpen={setIsRenewModalOpen}
              passHolder={passHolder}
            />
          </div>
        ) : (
          <div className="mx-1 text-[14px] font-semibold text-[#767676]">
            {capitalizeFirstLetter(passHolder.type)} Pass
          </div>
        )}
      </div>
    </div>
  )
}
