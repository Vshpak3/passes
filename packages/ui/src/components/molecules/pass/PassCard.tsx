import { PassDto, PassDtoTypeEnum } from "@passes/api-client"
import { useRouter } from "next/router"
import InfoIcon from "public/icons/pink-square-info.svg"
import { FC, useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/Button"
import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { MAX_PINNED_PASSES } from "src/config/pass"
import { redirectUnauthedToLogin } from "src/helpers/authRouter"
import { formatText } from "src/helpers/formatters"
import { useBuyPassModal } from "src/hooks/context/useBuyPassModal"
import { useCreatorPinnedPasses } from "src/hooks/passes/useCreatorPasses"
import { useUser } from "src/hooks/useUser"

interface PassCardProps {
  pass: PassDto
}

export const getPassType = (passType: PassDtoTypeEnum) => {
  const types = {
    [PassDtoTypeEnum.Lifetime]: "Lifetime",
    [PassDtoTypeEnum.Subscription]: "30 days",
    [PassDtoTypeEnum.External]: ""
  }

  return types[passType] ? types[passType] : ""
}

export const PassCard: FC<PassCardProps> = ({ pass }) => {
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
    <div className="flex max-w-[300px] flex-col border border-passes-dark-200 bg-[#0E0A0F]/25 px-3 py-4">
      <PassMedia
        animationType={pass.animationType}
        imageType={pass.imageType}
        passId={pass.passId}
      />
      <div className="flex h-full flex-col items-start pt-4 text-[#ffff]/90">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="text-lg font-[500]">{pass.title}</div>
          <div className="flex flex-row items-center">
            <span className="py-2">
              ${pass.price} / {getPassType(pass.type)}
            </span>
          </div>
        </div>
        {pass.type === PassDtoTypeEnum.Subscription && (
          <div className="mt-2 flex w-full flex-row items-center justify-between">
            <div>
              {pass.totalMessages !== null && pass.totalMessages > 0 && (
                <span className="flex flex-row gap-1 text-sm text-white md:text-xs">
                  <span className="font-[700] text-white">
                    {pass.totalMessages}
                  </span>
                  <span className="text-gray-400">free message(s)</span>
                </span>
              )}
              {pass.totalMessages === null && (
                <span className="flex flex-col text-sm text-gray-400 md:text-xs">
                  <span className="font-[700] text-white">Unlimited</span>
                  <span>free messages</span>
                </span>
              )}
            </div>
            <div className="text-sm font-[500] text-gray-400 md:text-xs">
              {pass.freetrial ? "Free trial" : "No free trial"}
            </div>
          </div>
        )}
        <div className="mt-2 mb-auto w-full border-y border-y-[#2C282D]">
          <p className="py-3 text-xs font-medium leading-[18px] text-white/70">
            {formatText(pass.description)}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between py-2">
          {pass.remainingSupply && pass.totalSupply ? (
            <p className=" text-sm font-medium leading-[16px]">
              <span className="text-xs font-normal leading-[23px] text-white/70">
                {pass.remainingSupply}/{pass.totalSupply} left
              </span>
            </p>
          ) : (
            <div />
          )}
          <InfoIcon />
        </div>
        <Button
          className="w-full rounded-full py-2 text-center"
          onClick={() => {
            redirectUnauthedToLogin(user, router) ||
              (isCreator ? pinOrUnpinPass() : setPass(pass))
          }}
          variant="pink"
        >
          {isCreator
            ? `${isPinned ? "Unpin" : "Pin"} Membership`
            : "Buy Membership"}
        </Button>
      </div>
    </div>
  )
}
