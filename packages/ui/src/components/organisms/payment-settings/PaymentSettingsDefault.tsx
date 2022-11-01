import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { PayinMethodDtoMethodEnum } from "@passes/api-client"
import classNames from "classnames"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { FC } from "react"

import { PayinMethodDisplayNames } from "src/helpers/payment/serialize"
import { usePayinMethod } from "src/hooks/usePayinMethod"
import { CreditCardEntry } from "./CreditCardEntry"

interface PaymentSettingsDefaultProps {
  isEmbedded: boolean
}

export const PaymentSettingsDefault: FC<PaymentSettingsDefaultProps> = ({
  isEmbedded
}) => {
  const { defaultPayinMethod, defaultCard } = usePayinMethod()

  const hasDefaultPaymentMethod =
    defaultPayinMethod?.method !== PayinMethodDtoMethodEnum.None

  const defaultPaymentCard = defaultCard ? (
    <div className="align-center mt-3 flex gap-6">
      <CreditCardEntry card={defaultCard} showName={false} />
    </div>
  ) : null
  const defaultPaymentNone = (
    <div className="mr-2 rounded-full border-2 border-passes-dark-200 py-2 px-4 font-[500]">
      None
    </div>
  )
  const defaultPaymentPhantom = () => {
    const payInMethodChain = defaultPayinMethod?.chain
    return (
      <div className="mt-3 flex flex-row items-center">
        <PhantomIcon width="40px" />
        <span className="mx-3 font-[700]">Phantom Wallet</span>
        <span>
          {payInMethodChain
            ? PayinMethodDisplayNames[payInMethodChain]
            : "USDC"}
        </span>
      </div>
    )
  }
  const defaultPaymentMetamask = (type: string) => {
    const payInMethodChain = defaultPayinMethod?.chain
    const coin = payInMethodChain ? `(${payInMethodChain})` : ""
    return (
      <div className="mt-3 flex flex-row items-center">
        <MetamaskIcon width="40px" />
        <span className="mx-3 font-[700]">Metamask Wallet</span>
        <span>{`${type} ${coin}`}</span>
      </div>
    )
  }

  const renderDefaultPayment = () => {
    const payInMethod = defaultPayinMethod?.method
    const defaultPayment = {
      [PayinMethodDtoMethodEnum.None]: defaultPaymentNone,
      [PayinMethodDtoMethodEnum.PhantomCircleUsdc]: defaultPaymentPhantom(),
      [PayinMethodDtoMethodEnum.MetamaskCircleEth]:
        defaultPaymentMetamask("ETH"),
      [PayinMethodDtoMethodEnum.MetamaskCircleUsdc]:
        defaultPaymentMetamask("USDC"),
      [PayinMethodDtoMethodEnum.CircleCard]: defaultPaymentCard
    }

    return payInMethod ? defaultPayment[payInMethod] : null
  }

  return (
    <div className="my-8 flex flex-col gap-6 xl:flex-row">
      <div
        className={classNames(
          hasDefaultPaymentMethod
            ? "flex-col items-start justify-start"
            : "items-center justify-between",
          "flex w-full gap-2 rounded-[15px] border border-passes-dark-200 bg-[#1B141D]/50 py-6 px-6"
        )}
      >
        <span className="text-[15px] font-bold text-white">
          {isEmbedded ? "Select" : "Default"} Payment Method:
        </span>
        {renderDefaultPayment()}
      </div>
    </div>
  )
}
