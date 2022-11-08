import { PassDto, PassDtoTypeEnum } from "@passes/api-client"
import classNames from "classnames"
import { useRouter } from "next/router"
import InfoIcon from "public/icons/square-info-icon.svg"
import { FC, useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/button/Button"
import { IconTooltip } from "src/components/atoms/IconTooltip"
import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { MAX_PINNED_PASSES } from "src/config/pass"
import { redirectUnauthedToLogin } from "src/helpers/authRouter"
import { formatText } from "src/helpers/formatters"
import { useBuyPassModal } from "src/hooks/context/useBuyPassModal"
import { useCreatorPinnedPasses } from "src/hooks/passes/useCreatorPasses"
import { useUser } from "src/hooks/useUser"

interface PassCardProps {
  pass: PassDto
  isPinnedPass?: boolean
}

export const getPassType = (passType: PassDtoTypeEnum) => {
  const types = {
    [PassDtoTypeEnum.Lifetime]: "Lifetime",
    [PassDtoTypeEnum.Subscription]: "30 days",
    [PassDtoTypeEnum.External]: ""
  }

  return types[passType] ? types[passType] : ""
}

export const PassCard: FC<PassCardProps> = ({ pass, isPinnedPass = false }) => {
  const { setPass } = useBuyPassModal()

  const { user } = useUser()
  const router = useRouter()
  const isCreator = pass.creatorId === user?.userId

  const { pinnedPasses, pinPass, unpinPass } = useCreatorPinnedPasses(
    pass.creatorId || ""
  )
  const [isPinned, setIsPinned] = useState<boolean>(!!pass.pinnedAt)

  const pinOrUnpinPass = async () => {
    if (!isPinned && pinnedPasses.length === MAX_PINNED_PASSES) {
      toast.error(`You can't pin more than ${MAX_PINNED_PASSES} passes`)
      return
    }
    isPinned ? await unpinPass(pass) : await pinPass(pass)
    setIsPinned(!isPinned)
  }

  return (
    <div
      className={classNames(
        isPinnedPass && "max-w-[350px] px-[24px]",
        "flex min-h-[170px] flex-col rounded-[5px] bg-[#0E0A0F]/25 px-[12px] py-4"
      )}
    >
      <PassMedia
        animationType={pass.animationType}
        imageType={pass.imageType}
        isPinnedPass={isPinnedPass}
        passId={pass.passId}
      />
      <div
        className={classNames(
          "flex min-h-[300px] flex-col items-start pt-4 text-[#ffff]/90"
        )}
      >
        <div
          className={classNames(
            isPinnedPass
              ? "flex w-full flex-row justify-start"
              : "flex w-full flex-col"
          )}
        >
          <div
            className={classNames(
              isPinnedPass ? "justify-start" : "justify-center",
              "flex w-full flex-row items-center"
            )}
          >
            <div className="text-lg font-[500]">{pass.title}</div>
          </div>
          <div
            className={classNames(
              isPinnedPass
                ? "justify-end text-right"
                : "justify-center text-center",
              "w-full py-2"
            )}
          >
            ${pass.price} / {getPassType(pass.type)}
          </div>
        </div>
        {pass.type === PassDtoTypeEnum.Subscription && (
          <div className="mt-2 flex w-full flex-row items-center justify-between">
            <div className="flex flex-col">
              {pass.totalMessages !== null && pass.totalMessages > 0 && (
                <span className="text-sm text-white md:text-xs">
                  <span className="font-[700] text-white">
                    {pass.totalMessages}{" "}
                  </span>
                  <span className="text-[#767676]">free messages</span>
                </span>
              )}
              {pass.totalMessages === null && (
                <span className="flex text-sm text-gray-400 md:text-xs">
                  <span className="mr-[3px] font-[700] text-white">
                    Unlimited
                  </span>{" "}
                  <span className="text-[#767676]">free messages</span>
                </span>
              )}
            </div>
            <div className="text-sm font-[500] text-gray-400 md:text-xs">
              {pass.freetrial ? "Free trial" : "No free trial"}
            </div>
          </div>
        )}
        <div
          className={classNames(
            isPinnedPass ? "w-full" : "w-[90%]",
            "mt-2 mb-auto border-y border-y-[#2C282D]"
          )}
        >
          <p
            className={classNames(
              isPinnedPass ? "w-full" : "w-[110%]",
              "py-3 text-xs font-medium leading-[18px] text-white/70"
            )}
          >
            {formatText(pass.description)}
          </p>
        </div>
        <div className="mt-2 flex w-full items-center justify-between text-sm font-medium leading-[16px]">
          <span className="block text-xs font-normal leading-[23px] text-white/70">
            {pass.totalSupply ? (
              <p>
                {pass.remainingSupply} out of {pass.totalSupply} left
              </p>
            ) : (
              <p>Unlimted supply</p>
            )}
          </span>
          <IconTooltip
            Icon={InfoIcon}
            position="top"
            tooltipText="Test tooltip text"
          />
        </div>
        <Button
          className="mt-[12px] h-[44px] w-full rounded-full py-[10px] text-center"
          onClick={() => {
            redirectUnauthedToLogin(user, router) ||
              (isCreator ? pinOrUnpinPass() : setPass(pass))
          }}
          variant="pink"
        >
          {isCreator ? `${isPinned ? "Unpin" : "Pin"} Pass` : "Buy Membership"}
        </Button>
      </div>
    </div>
  )
}
