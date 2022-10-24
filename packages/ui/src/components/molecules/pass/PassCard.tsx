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
  return (
    <div className="rounded-[15px] border border-passes-dark-200 bg-[#0E0A0F] px-3 py-4">
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
              <span className="flex flex-col text-sm text-gray-400 md:text-xs">
                <span className="font-[700] text-white">Unlimited</span>
                <span>free messages</span>
              </span>
            </div>
            <div className="text-sm font-[500] text-gray-400 md:text-xs">
              {pass.freetrial ? "Free trial" : "No free trial"}
            </div>
          </div>
        )}
        <p className="mt-2 border-b border-t border-b-[#2C282D] border-t-[#2C282D] py-3 text-xs font-medium leading-[18px] text-white/70">
          {formatText(pass.description)}
        </p>
        <span className="py-2">
          ${pass.price} / {getPassType(pass.type)}
        </span>
        <button
          onClick={() => {
            isCreator ? null : setPass(pass) // TODO: add pass pinning
          }}
          className="w-full rounded-[50px] bg-passes-primary-color py-2 text-center"
        >
          {isCreator ? "Pin Pass" : "Mint NFT"}
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
