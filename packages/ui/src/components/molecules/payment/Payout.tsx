import {
  PayinMethodDtoChainEnum,
  PayoutDto,
  PayoutDtoPayoutStatusEnum,
  PayoutMethodDtoMethodEnum
} from "@passes/api-client"
import React, { FC } from "react"

interface PayoutProps {
  payout: PayoutDto
}

export const Payout: FC<PayoutProps> = ({ payout }) => {
  let payoutInfo: JSX.Element | null = null
  let method = ""
  let status = ""
  switch (payout.payoutMethod.method) {
    case PayoutMethodDtoMethodEnum.CircleWire:
      payoutInfo = <>N/A</>
      method = "Bank Wire"
      break
    case PayoutMethodDtoMethodEnum.CircleUsdc:
      // eslint-disable-next-line sonarjs/no-nested-switch
      switch (payout.chain) {
        case PayinMethodDtoChainEnum.Eth:
          payoutInfo = (
            <a href={`https://etherscan.io/tx/${payout.transactionHash}`}>
              {payout.transactionHash?.slice(0, 8)}...
            </a>
          )
          method = "Eth USDC"
          break
        case PayinMethodDtoChainEnum.Sol:
          payoutInfo = (
            <a href={`https://solscan.io/tx/${payout.transactionHash}`}>
              {payout.transactionHash?.slice(0, 8)}...
            </a>
          )
          method = "Sol USDC"
          break
      }
      break
  }

  switch (payout.payoutStatus) {
    case PayoutDtoPayoutStatusEnum.Successful:
      status = "Complete"
      break
    case PayoutDtoPayoutStatusEnum.Failed:
      status = "Failed"
      break
    default:
      status = "Pending"
      break
  }

  return (
    <div className="flex flex-row justify-between border-b border-passes-dark-200">
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700] text-passes-pink-100">
          {payoutInfo}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700] text-passes-pink-100">
          {payout.bankDescription ?? payout.address}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {new Date(payout.createdAt).toLocaleString() ?? "N/A"}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {"$" + payout.amount.toFixed(2)}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">{method}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <div className="mt-1 mr-1 rounded-full bg-[#667085] p-1" />
        <span className="text-[12px] font-[500]">{status}</span>
      </div>
    </div>
  )
}
