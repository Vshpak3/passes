import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import {
  PayinMethodDto,
  PayinMethodDtoChainEnum,
  PayinMethodDtoMethodEnum
} from "@passes/api-client"
import classNames from "classnames"
import { useRouter } from "next/router"
import CardIcon from "public/icons/bank-card.svg"
import DeleteIcon from "public/icons/delete-outline.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, Select } from "src/components/atoms"
import { Modal } from "src/components/organisms"
import Tab from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import { displayCardIcon } from "src/helpers/payment/paymentMethod"
import { usePayinMethod, useUser } from "src/hooks"

import AddCard from "./sub-tabs/AddCard"

interface Props {
  addCardHandler?: null | (() => void)
  isEmbedded?: boolean
  onSetDefaultPayment?: (value: PayinMethodDto) => void
}
const PaymentSettings = ({
  isEmbedded = false,
  onSetDefaultPayment
}: Props) => {
  const { addOrPopStackHandler } = useSettings() as ISettingsContext
  const {
    cards,
    defaultPayinMethod,
    setDefaultPayinMethod,
    getDefaultPayinMethod,
    deleteCard,
    getCards
  } = usePayinMethod()
  const defaultCard = cards.find(
    (card) => card.id === defaultPayinMethod?.cardId
  )
  const { register, getValues, setValue, watch } = useForm({
    defaultValues: {
      metamask:
        PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
        "." +
        PayinMethodDtoChainEnum.Eth,
      phantom: PayinMethodDtoChainEnum.Sol
    }
  })

  const handleSetDefaultPayInMethod = async (value: PayinMethodDto) => {
    await setDefaultPayinMethod(value)

    if (onSetDefaultPayment) {
      onSetDefaultPayment(value)
    }
  }

  useEffect(() => {
    switch (defaultPayinMethod?.method) {
      case PayinMethodDtoMethodEnum.MetamaskCircleEth:
      case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
        setValue(
          "metamask",
          defaultPayinMethod?.method + "." + defaultPayinMethod?.chain
        )
    }
  }, [defaultPayinMethod, setValue])
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
    const coin = payInMethodChain ? `(${payInMethodChain})` : ""
    return (
      <div className="mt-3 flex flex-row items-center">
        <PhantomIcon width="40px" />
        <span className="mx-3 font-[700]">Phantom Wallet</span>
        <span>{`USDC ${coin}`}</span>
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
              setTimeout(() => getCards(), 500)
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
      <div className="my-8 flex flex-col gap-6 xl:flex-row">
        <div
          className={classNames(
            hasDefaultPaymentMethod
              ? "flex-col items-start justify-start"
              : "items-center justify-between",
            "flex w-full gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 py-6 px-6"
          )}
        >
          <span className="text-[15px] font-bold text-white">
            Default Payment Method:
          </span>
          {renderDefaultPayment()}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="mb-3 text-[18px] font-bold text-white">
          Add Crypto Wallet as a Payment method
        </span>
        <div className="flex items-center justify-start">
          <div className="flex flex-1 flex-row items-center">
            <MetamaskIcon width="40px" />
            <span className="mx-4 w-[20%] text-[16px] font-bold text-white">
              Metamask
            </span>
            <Select
              register={register}
              selectOptions={
                isEmbedded
                  ? [
                      {
                        label: "USDC (ETH)",
                        value:
                          PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
                          "." +
                          PayinMethodDtoChainEnum.Eth
                      },
                      {
                        label: "ETH (ETH)",
                        value:
                          PayinMethodDtoMethodEnum.MetamaskCircleEth +
                          "." +
                          PayinMethodDtoChainEnum.Eth
                      }
                    ]
                  : [
                      {
                        label: "USDC (ETH)",
                        value:
                          PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
                          "." +
                          PayinMethodDtoChainEnum.Eth
                      },
                      {
                        label: "USDC (AVAX)",
                        value:
                          PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
                          "." +
                          PayinMethodDtoChainEnum.Avax
                      },
                      {
                        label: "USDC (MATIC)",
                        value:
                          PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
                          "." +
                          PayinMethodDtoChainEnum.Matic
                      }
                    ]
              }
              onChange={async (event: any) => {
                setValue("metamask", event.target.value)
              }}
              name="metamask"
              className="my-4 w-[130px] border-passes-dark-100 bg-transparent"
            />
          </div>
          {watch("metamask") ===
          defaultPayinMethod?.method + "." + defaultPayinMethod?.chain ? (
            <Button tag="button" variant="gray">
              <span className="text-[14px] font-[700]">Default</span>
            </Button>
          ) : (
            <Button
              onClick={async () =>
                handleSetDefaultPayInMethod({
                  method: getValues("metamask").split(
                    "."
                  )[0] as PayinMethodDtoMethodEnum,
                  chain: getValues("metamask").split(
                    "."
                  )[1] as PayinMethodDtoChainEnum
                })
              }
              tag="button"
              variant="purple-light"
            >
              <span className="font-[700]">Set Default</span>
            </Button>
          )}
        </div>
        <div className="flex items-center justify-start">
          <div className="flex flex-1 flex-row items-center">
            <PhantomIcon width="40px" />
            <span className="mx-4 w-[20%] text-[16px] font-bold text-white">
              Phantom
            </span>
            <Select
              register={register}
              defaultValue={{
                label: "USDC (SOL)",
                value: PayinMethodDtoChainEnum.Sol
              }}
              selectOptions={[
                { label: "USDC (SOL)", value: PayinMethodDtoChainEnum.Sol }
              ]}
              onChange={async (event: any) => {
                setValue("phantom", event.target.value)
              }}
              name="phantom"
              className="my-4 w-[130px] border-passes-dark-100 bg-transparent"
            />
          </div>
          {PayinMethodDtoMethodEnum.PhantomCircleUsdc ===
          defaultPayinMethod?.method ? (
            <Button tag="button" variant="gray">
              <span className="text-[14px] font-[700]">Default</span>
            </Button>
          ) : (
            <Button
              onClick={async () =>
                handleSetDefaultPayInMethod({
                  method: PayinMethodDtoMethodEnum.PhantomCircleUsdc,
                  chain: getValues("phantom") as PayinMethodDtoChainEnum
                })
              }
              tag="button"
              variant="purple-light"
            >
              <span className="font-[700]">Set Default</span>
            </Button>
          )}
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <span className="text-[18px] font-bold text-white">
          Add Card as a Payment Method
        </span>
        <div className="w-[130px]">
          <Button
            icon={<CardIcon />}
            variant="pink"
            tag="button"
            className="mt-5 mb-6"
            onClick={
              isEmbedded
                ? () => setOpen(true)
                : () => addOrPopStackHandler(SubTabsEnum.AddCard)
            }
          >
            Add card
          </Button>
        </div>
        <div>
          {cards.map((item) => (
            <div
              key={item.id}
              className="my-5 flex rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-5"
            >
              <div className="flex-1">
                <span className="text-[15px] font-[700]">{item.name}</span>
                <div className="mt-4 flex flex-row">
                  {displayCardIcon(item.firstDigit, 35)}
                  <span className="mx-6 text-[14px] font-[500]">
                    **** **** **** {item.fourDigits}
                  </span>
                  <div className="mr-1 flex flex-row justify-between">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <span className="-mb-2 w-8 text-[10px] font-[500] opacity-70">
                          VALID
                        </span>
                        <span className="w-8 text-[10px] font-[500] opacity-70">
                          THRU
                        </span>
                      </div>
                      <span className="ml-2 text-[14px] font-[500]">
                        {item.expMonth}/{item.expYear.toString().slice(-2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-4">
                <div>
                  {item.id === defaultPayinMethod?.cardId ? (
                    <Button tag="button" variant="gray">
                      <span className="text-[14px] font-[700]">Default</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={async () =>
                        handleSetDefaultPayInMethod({
                          cardId: item.id,
                          method: PayinMethodDtoMethodEnum.CircleCard
                        })
                      }
                      tag="button"
                      variant="purple-light"
                    >
                      <span className="font-[700]">Set Default</span>
                    </Button>
                  )}
                </div>
                <button
                  onClick={() => {
                    deleteCard(item.id)
                    getDefaultPayinMethod()
                  }}
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/10"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default PaymentSettings
