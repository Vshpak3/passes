import {
  PayinDto,
  PayinDtoCallbackEnum,
  PayinDtoPayinStatusEnum,
  PayinMethodDtoChainEnum,
  PayinMethodDtoMethodEnum,
  PaymentApi
} from "@passes/api-client"
import { format } from "date-fns"
import React, { FC, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { formatCurrency } from "src/helpers/formatters"

interface PayinProps {
  payin: PayinDto
}

export const Payin: FC<PayinProps> = ({ payin }) => {
  let payinInfo: JSX.Element | null = null
  let method = ""
  let status = ""
  let reason = ""
  const {
    fourDigits,
    payinId,
    createdAt,
    transactionHash,
    payinStatus,
    payinMethod,
    amount,
    address,
    callback
  } = payin
  const [cancelled, setCancelled] = useState<boolean>()
  switch (payinMethod.method) {
    case PayinMethodDtoMethodEnum.CircleCard:
      payinInfo = <>N/A</>
      method = "Credit/Debit Card"
      break
    case PayinMethodDtoMethodEnum.PhantomCircleUsdc:
      payinInfo = (
        <a href={`https://solscan.io/tx/${transactionHash}`}>
          {transactionHash?.slice(0, 8)}...
        </a>
      )
      method = "Sol USDC"
      break
    case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
      // eslint-disable-next-line sonarjs/no-nested-switch
      switch (payinMethod.chain) {
        case PayinMethodDtoChainEnum.Eth:
          payinInfo = (
            <a href={`https://etherscan.io/tx/${transactionHash}`}>
              {transactionHash?.slice(0, 8)}...
            </a>
          )
          method = "Eth USDC"
          break
        case PayinMethodDtoChainEnum.Avax:
          payinInfo = (
            <a href={`https://snowtrace.io/tx/${transactionHash}`}>
              {transactionHash?.slice(0, 8)}...
            </a>
          )
          method = "Avax USDC"
          break
        case PayinMethodDtoChainEnum.Matic:
          payinInfo = (
            <a href={`https://polygonscan.com/tx/${transactionHash}`}>
              {transactionHash?.slice(0, 8)}...
            </a>
          )
          method = "Polygon USDC"
          break
      }
      break
    case PayinMethodDtoMethodEnum.MetamaskCircleEth:
      payinInfo = (
        <a href={`https://etherscan.io/tx/${transactionHash}`}>
          {transactionHash?.slice(0, 8)}...
        </a>
      )
      method = "Eth Native"

      break
  }

  let cancellable = false

  switch (payinStatus) {
    case PayinDtoPayinStatusEnum.SuccessfulReady:
    case PayinDtoPayinStatusEnum.Successful:
      status = "Complete"
      break
    case PayinDtoPayinStatusEnum.ActionRequired:
      status = "Action Required"
      cancellable = true
      break
    case PayinDtoPayinStatusEnum.Failed:
    case PayinDtoPayinStatusEnum.FailedReady:
    case PayinDtoPayinStatusEnum.FailCallbackFailed:
    case PayinDtoPayinStatusEnum.CreateCallbackFailed:
    case PayinDtoPayinStatusEnum.SuccessCallbackFailed:
    case PayinDtoPayinStatusEnum.Uncreated:
    case PayinDtoPayinStatusEnum.UncreatedReady:
      status = "Failed"
      break
    case PayinDtoPayinStatusEnum.Reverted:
      status = "Reverted"
      break
    default:
      status = "Pending"
      cancellable = payinMethod.method !== PayinMethodDtoMethodEnum.CircleCard
      break
  }
  switch (callback) {
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
    await paymentApi.cancelPayin({ payinId: payinId })
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
          {fourDigits ? "**** " + fourDigits : address.slice(0, 8) + "..."}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">
          {format(createdAt, "LL/dd/yyyy")}
          <br />
          {format(createdAt, "hh:mm a")}
        </span>
      </div>
      <div className="flex h-[72px] flex-1 items-center justify-center text-[#B8B8B8]">
        <span className="text-[12px] font-[500]">{formatCurrency(amount)}</span>
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
          {!cancelled && cancellable && (
            <Button onClick={cancel}>Cancel</Button>
          )}
        </span>
      </div>
    </div>
  )
}
