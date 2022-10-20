import { PassDto } from "@passes/api-client"
import { FC } from "react"
import { PassMedia } from "src/components/atoms/passes/PassMedia"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
// import { EthereumIcon } from "src/icons/eth-icon"
import { SolanaIcon } from "src/icons/sol-icon"

interface PassTileCardProps {
  pass: PassDto
}

export const PassTileCard: FC<PassTileCardProps> = ({ pass }) => {
  return (
    <>
      <div className="col-span-1 w-full rounded rounded-[20px] border border-[#2C282D] py-[24px] px-[16px]">
        <div className="aspect-[1/1] w-full rounded-[20px]">
          <PassMedia
            passId={pass.passId}
            imageType={pass.imageType}
            animationType={pass.animationType}
          />
        </div>
        <div
          className={
            " grow cursor-pointer rounded-xl drop-shadow transition-colors"
          }
        >
          <div className="flex h-full flex-col items-start justify-between pt-[20px] text-[#ffff]/90">
            <div className="align-items flex w-full flex-row items-center justify-between">
              <div className="text-[18px] font-[700]">{pass.title}</div>
              <div className="flex flex-row gap-[5px] text-[18px] font-[700]">
                <ConditionRendering condition={pass.chain === "eth"}>
                  <SolanaIcon /> Ethereum
                </ConditionRendering>
                <ConditionRendering condition={pass.chain === "sol"}>
                  <SolanaIcon /> Solana
                </ConditionRendering>
              </div>
            </div>
            <div className="border-b border-b-[#2C282D] py-[12px]">
              <span className="w-full text-[12px] font-bold text-[#ffffff76]">
                {pass.description}
              </span>
            </div>
            <div className="mt-[12px]">
              <span className="ml-2 text-[14px] font-light">
                {pass.totalMessages}
              </span>
            </div>
            <div className="mt-[12px] w-full">
              <ConditionRendering condition={pass.chain === "eth"}>
                <button className="w-full rounded-[50px] bg-[#9C4DC1] py-[10px] px-[33px] !text-[18px] font-bold">
                  View on EtherScan
                </button>
              </ConditionRendering>
              <ConditionRendering condition={pass.chain === "sol"}>
                <button className="w-full rounded-[50px] bg-[#9C4DC1] py-[10px] px-[33px] !text-[18px] font-bold">
                  View on SolanaScan
                </button>
              </ConditionRendering>
            </div>
            <div className="mt-[12px] w-full">
              <span className="text-[#767676]">
                {pass.createdAt.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
