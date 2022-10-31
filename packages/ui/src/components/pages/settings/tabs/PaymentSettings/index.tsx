import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import classNames from "classnames"
import { useRouter } from "next/router"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { FC, memo, useEffect, useState } from "react"

import { Button } from "src/components/atoms/Button"
import { Modal } from "src/components/organisms/Modal"
import { PaymenetSettingsCreditCard } from "src/components/organisms/payment-settings/PaymenetSettingsCreditCard"
import {
  payinMethodDisplayNames,
  PaymentSettingsCrypto
} from "src/components/organisms/payment-settings/PaymentSettingsCrypto"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { displayCardIcon } from "src/helpers/payment/paymentMethod"
import { usePayinMethod } from "src/hooks/usePayinMethod"
import { useUser } from "src/hooks/useUser"
import AddCard from "./sub-tabs/AddCard"

interface PaymentSettingsProps {
  addCardHandler?: null | (() => void)
  isEmbedded?: boolean
  onSetDefaultPayment?: (value: PayinMethodDto) => void
}

const PaymentSettings: FC<PaymentSettingsProps> = ({
  isEmbedded = false,
  onSetDefaultPayment
}) => {
  const { addOrPopStackHandler } = useSettings() as SettingsContextProps
  const { defaultPayinMethod, setDefaultPayinMethod, getCards, defaultCard } =
    usePayinMethod()

  const handleSetDefaultPayInMethod = async (value: PayinMethodDto) => {
    await setDefaultPayinMethod(value)

    if (onSetDefaultPayment) {
      onSetDefaultPayment(value)
    }
  }

  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])

  const hasDefaultPaymentMethod =
    defaultPayinMethod?.method !== PayinMethodDtoMethodEnum.None

  const defaultPaymentCard = defaultCard ? (
    <div className="align-center mt-3 flex gap-6">
      {displayCardIcon(defaultCard.firstDigit, 35)}
      <span className="text-[14px] font-[500] opacity-70">
        **** **** **** {defaultCard.fourDigits}
      </span>
      <div className="flex flex-row">
        <div className="mr-2 flex flex-col">
          <span className="-mb-2 w-8 text-[10px] font-[500] opacity-70">
            VALID
          </span>
          <span className="w-8 text-[10px] font-[500] opacity-70">THRU</span>
        </div>
        <span>{`${defaultCard.expMonth}/${defaultCard.expYear}`}</span>
      </div>
      <span className="text-[14px] font-bold">{defaultCard.name}</span>
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
            ? payinMethodDisplayNames[payInMethodChain]
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

  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      {isEmbedded && (
        <Modal isOpen={open} setOpen={setOpen}>
          <AddCard
            callback={() => {
              setOpen(false)
              getCards()
            }}
          />
        </Modal>
      )}
      {!isEmbedded && (
        <Tab
          withBackMobile
          title="Payment Settings"
          description="Add and manage payment methods."
        />
      )}
      {!isEmbedded && (
        <Button
          variant="pink"
          tag="button"
          className="mt-5"
          onClick={() => addOrPopStackHandler(SubTabsEnum.PaymentHistory)}
        >
          View Payment History
        </Button>
      )}
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
      <PaymentSettingsCrypto
        isEmbedded={isEmbedded}
        defaultPayinMethod={defaultPayinMethod}
        handleSetDefaultPayInMethod={handleSetDefaultPayInMethod}
      />
      <PaymenetSettingsCreditCard
        isEmbedded={isEmbedded}
        setOpen={setOpen}
        addOrPopStackHandler={addOrPopStackHandler}
        handleSetDefaultPayInMethod={handleSetDefaultPayInMethod}
      />
    </>
  )
}

export default memo(PaymentSettings) // eslint-disable-line import/no-default-export
