import {
  PassDto,
  PassDtoTypeEnum,
  PassHolderDtoChainEnum
} from "@passes/api-client"
import EthereumIcon from "public/icons/eth.svg"
import SolanaIcon from "public/icons/sol.svg"
import { FC, useState } from "react"
import { toast } from "react-toastify"

import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { MAX_PINNED_PASSES } from "src/config/pass"
import { formatText } from "src/helpers/formatters"
import { useBuyPassModal } from "src/hooks/context/useBuyPassModal"
import { useCreatorPinnedPasses } from "src/hooks/passes/useCreatorPasses"
import { useUser } from "src/hooks/useUser"

interface PassCardProps {
  pass: PassDto
}

const getPassType = (passType: PassDtoTypeEnum) => {
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
    <div className="flex max-w-[500px] flex-col rounded-xl border border-passes-dark-200 bg-[#0E0A0F] px-3 py-4">
      <PassMedia
        passId={pass.passId}
        imageType={pass.imageType}
        animationType={pass.animationType}
      />
      <div className="flex h-full flex-col items-start pt-4 text-[#ffff]/90">
        <div className="align-items flex w-full flex-row items-center justify-between">
          <div className="text-lg font-[500]">{pass.title}</div>
          <div className="flex flex-row items-center">
            {pass.chain === PassHolderDtoChainEnum.Eth ? (
              <>
                <EthereumIcon /> <span className="ml-1 text-sm">Ethereum</span>
              </>
            ) : (
              pass.chain === PassHolderDtoChainEnum.Sol && (
                <>
                  <SolanaIcon /> <span className="ml-1 text-sm">Solana</span>
                </>
              )
            )}
          </div>
        </div>
        {pass.type === PassDtoTypeEnum.Subscription && (
          <div className="align-items mt-2 flex w-full flex-row items-center justify-between">
            <div>
              {pass.totalMessages !== null && pass.totalMessages > 0 && (
                <span className="flex flex-col text-sm text-white md:text-xs">
                  <span className="font-[700] text-white">
                    {pass.totalMessages}
                  </span>
                  <span>free message(s)</span>
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
        <div className="mt-2 mb-auto w-full border-b border-t border-b-[#2C282D] border-t-[#2C282D]">
          <p className="py-3 text-xs font-medium leading-[18px] text-white/70">
            {formatText(pass.description)}
          </p>
        </div>
        <span className="py-2">
          ${pass.price} / {getPassType(pass.type)}
        </span>
        <button
          onClick={() => {
            isCreator ? pinOrUnpinPass() : setPass(pass)
          }}
          className="w-full rounded-full bg-passes-primary-color py-2 text-center"
        >
          {isCreator
            ? `${isPinned ? "Unpin" : "Pin"} Membership`
            : "Buy Membership"}
        </button>
        <p className="mt-2 text-sm font-medium leading-[16px]">
          <span className="text-xs font-normal leading-[23px] text-white/70">
            {pass.remainingSupply}/{pass.totalSupply} left
          </span>
        </p>
      </div>
    </div>
  )
}
