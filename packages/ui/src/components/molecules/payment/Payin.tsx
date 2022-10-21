import {
  PayinDto,
  PayinDtoCallbackEnum,
  PayinDtoPayinStatusEnum,
  PayinMethodDtoChainEnum,
  PayinMethodDtoMethodEnum,
  PaymentApi
} from "@passes/api-client"
import React, { useState } from "react"
import { Button } from "src/components/atoms/Button"

interface PayinProps {
  payin: PayinDto
}

export const Payin = ({ payin }: PayinProps) => {
  let payinInfo: JSX.Element = <></>
  let method = ""
  let status = ""
  let reason = ""
  const [cancelled, setCancelled] = useState<boolean>()
  switch (payin.payinMethod.method) {
    case PayinMethodDtoMethodEnum.CircleCard:
      payinInfo = <>N/A</>
      method = "Credit/Debit Card"
      break
    case PayinMethodDtoMethodEnum.PhantomCircleUsdc:
      payinInfo = (
        <a href={`https://solscan.io/tx/${payin.transactionHash}`}>
          {payin.transactionHash?.slice(0, 8)}...
        </a>
      )
      method = "Sol USDC"
      break
    case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
      // eslint-disable-next-line sonarjs/no-nested-switch
      switch (payin.payinMethod.chain) {
        case PayinMethodDtoChainEnum.Eth:
          payinInfo = (
            <a href={`https://etherscan.io/tx/${payin.transactionHash}`}>
              {payin.transactionHash?.slice(0, 8)}...
            </a>
          )
          method = "Eth USDC"
          break
        case PayinMethodDtoChainEnum.Avax:
          payinInfo = (
            <a href={`https://snowtrace.io/tx/${payin.transactionHash}`}>
              {payin.transactionHash?.slice(0, 8)}...
            </a>
          )
          method = "Avax USDC"
          break
        case PayinMethodDtoChainEnum.Matic:
          payinInfo = (
            <a href={`https://polygonscan.com/tx/${payin.transactionHash}`}>
              {payin.transactionHash?.slice(0, 8)}...
            </a>
          )
          method = "Polygon USDC"
          break
      }
      break
    case PayinMethodDtoMethodEnum.MetamaskCircleEth:
      payinInfo = (
        <a href={`https://etherscan.io/tx/${payin.transactionHash}`}>
          {payin.transactionHash?.slice(0, 8)}...
        </a>
      )
      method = "Eth Native"

      break
  }

  switch (payin.payinStatus) {
    case PayinDtoPayinStatusEnum.SuccessfulReady:
    case PayinDtoPayinStatusEnum.Successful:
      status = "Complete"
      break
    case PayinDtoPayinStatusEnum.ActionRequired:
      status = "Action Required"
      break
    case PayinDtoPayinStatusEnum.Failed:
    case PayinDtoPayinStatusEnum.FailedReady:
    case PayinDtoPayinStatusEnum.FailCallbackFailed:
    case PayinDtoPayinStatusEnum.CreateCallbackFailed:
    case PayinDtoPayinStatusEnum.SuccessCallbackFailed:
      status = "Failed"
      break
    case PayinDtoPayinStatusEnum.Reverted:
      status = "Reverted"
      break
    default:
      status = "Pending"
      break
  }
  switch (payin.callback) {
    case PayinDtoCallbackEnum.TippedMessage:
      reason = "Tipped Message"
      break
    case PayinDtoCallbackEnum.CreateNftLifetimePass:
      reason = "Lifetime Pass Purchase"
      break
    case PayinDtoCallbackEnum.CreateNftSubscriptionPass:
      reason = "Subscription Pass Purchase"
      break
    case PayinDtoCallbackEnum.RewnewNftPass:
      reason = "Subscription Pass Renewal"
      break
    case PayinDtoCallbackEnum.PurchaseFeedPost:
      reason = "Post Purchase"
      break
    case PayinDtoCallbackEnum.PurchaseDmPost:
      reason = "DM Purchase"
      break
    case PayinDtoCallbackEnum.TipPost:
      reason = "Post Tip"
      break
  }
  if (cancelled) {
    status = "Failed"
  }

  const cancel = async () => {
    const paymentApi = new PaymentApi()
    await paymentApi.cancelPayin({ payinId: payin.payinId })
    setCancelled(true)
  }
  return (
    <div className="flex flex-row justify-between border-b border-passes-dark-200">
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700] text-passes-pink-100">
          {payinInfo}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700] text-passes-pink-100">
          {payin.fourDigits
            ? "**** **** **** " + payin.fourDigits
            : payin.address.slice(0, 8) + "..."}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {new Date(payin.createdAt).toLocaleString() ?? "N/A"}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {"$" + payin.amount.toFixed(2)}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">{method}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <div className="mt-1 mr-1 rounded-full bg-[#667085] p-1" />
        <span className="text-[12px] font-[500]">{status}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[12px] font-[500]">{reason}</span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center">
        <span className="text-[14px] font-[700] text-passes-pink-100">
          {!cancelled &&
            payin.payinMethod.method !== PayinMethodDtoMethodEnum.CircleCard &&
            status === "Pending" && <Button onClick={cancel}>Cancel</Button>}
        </span>
      </div>
    </div>
  )
}
