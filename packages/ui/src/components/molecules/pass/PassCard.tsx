import {
  PassDto,
  PassDtoTypeEnum,
  PassHolderDtoChainEnum
} from "@passes/api-client"
import EthereumIcon from "public/icons/eth.svg"
import SolanaIcon from "public/icons/sol.svg"
import React, { FC } from "react"
import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { formatText } from "src/helpers/formatters"
import { useBuyPassModal } from "src/hooks/useBuyPassModal"
import { useUser } from "src/hooks/useUser"

interface PassCardProps {
  pass: PassDto
}

export const PassCard: FC<PassCardProps> = ({ pass }) => {
  const { setPass } = useBuyPassModal()
  const { user } = useUser()
  const isCreator = pass.creatorId === user?.userId
  return (
    <div className="min-w-[218px] max-w-[218px] rounded-[15px] border border-passes-dark-200 bg-[#0E0A0F] px-5 py-4">
      <PassMedia
        passId={pass.passId}
        imageType={pass.imageType}
        animationType={pass.animationType}
      />
      <div className="flex h-full flex-col items-start justify-between pt-[20px] text-[#ffff]/90">
        <div className="align-items flex w-full flex-row items-center justify-between">
          <div className="text-[18px] font-[700]">{pass.title}</div>
          <div className="flex flex-row gap-[5px] text-[18px] font-[700]">
            {pass.chain === PassHolderDtoChainEnum.Eth ? (
              <>
                <EthereumIcon /> Ethereum
              </>
            ) : (
              pass.chain === PassHolderDtoChainEnum.Sol && (
                <>
                  <SolanaIcon /> Solana
                </>
              )
            )}
          </div>
        </div>
        {pass.type === PassDtoTypeEnum.Subscription && (
          <div className="align-items flex w-full flex-row items-center justify-between">
            <div className="text-[18px] font-[700]">
              {pass.totalMessages !== null && pass.totalMessages > 0 && (
                <div className="mt-[12px]">
                  <span className="ml-2 text-[14px] font-light">
                    {pass.totalMessages} free message(s)
                  </span>
                </div>
              )}
              {pass.totalMessages === null && (
                <div className="mt-[12px]">
                  <span className="ml-2 text-[14px] font-light">
                    Unlimited free messages
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-row gap-[5px] text-[18px] font-[700]">
              {pass.freetrial ? "Free trial" : "No free trial"}
            </div>
          </div>
        )}
      </div>
      <p className="mt-2.5 border-b border-t border-b-[#2C282D] border-t-[#2C282D] text-xs font-medium leading-[18px] text-white/70">
        {formatText(pass.description)}
      </p>
      <button
        onClick={() => {
          isCreator ? null : setPass(pass) // TODO: add pass pinning
        }}
        className="mt-3 w-full rounded-[50px] bg-passes-primary-color py-2.5 text-center"
      >
        {isCreator ? "Pin Pass" : "Purchase Pass"}
      </button>

      <p className="mt-[14px] text-sm font-medium leading-[16px]">
        ${pass.price}
        <span className="text-xs font-normal leading-[23px] text-white/70">
          ({pass.remainingSupply} out of {pass.totalSupply} left)
        </span>
      </p>
    </div>
  )
}
