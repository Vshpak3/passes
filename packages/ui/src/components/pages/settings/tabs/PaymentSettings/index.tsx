import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import {
  PayinMethodDtoChainEnum,
  PayinMethodDtoMethodEnum
} from "@passes/api-client"
import classNames from "classnames"
import { useRouter } from "next/router"
import CardIcon from "public/icons/bank-card.svg"
import DeleteIcon from "public/icons/delete-outline.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, Select } from "src/components/atoms"
import Tab from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import { displayCardIcon } from "src/helpers/payment/paymentMethod"
import { usePayinMethod, useUser } from "src/hooks"

interface Props {
  addCardHandler?: null | (() => void)
  isEmbedded?: boolean
}
const PaymentSettings = ({
  addCardHandler = null,
  isEmbedded = false
}: Props) => {
  const { addOrPopStackHandler } = useSettings() as ISettingsContext
  const {
    cards,
    defaultPayinMethod,
    setDefaultPayinMethod,
    getDefaultPayinMethod,
    deleteCard
  } = usePayinMethod()
  const defaultCard = cards.find(
    (card) => card.id === defaultPayinMethod?.cardId
  )
  const { register, getValues, setValue } = useForm()

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

  return (
    <>
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
            defaultCard
              ? "flex-col items-start justify-start"
              : "items-center justify-between",
            "flex w-full  gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 py-6 px-6"
          )}
        >
          <span className="text-[15px] font-bold text-white">
            Default Payment Method:
          </span>
          {defaultCard ? (
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
                  <span className="w-8 text-[10px] font-[500] opacity-70">
                    THRU
                  </span>
                </div>
                <span>{`${defaultCard.expMonth}/${defaultCard.expYear}`}</span>
              </div>
              <span className="text-[14px] font-bold">{defaultCard.name}</span>
            </div>
          ) : (
            <div className="mr-2 rounded-full border-2 border-passes-dark-200 py-2 px-4 font-[500]">
              None
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[18px] font-bold text-white">
          Add Crypto Wallet as a Payment method
        </span>
        <div className="flex items-center justify-start">
          <div className="flex flex-1 flex-row items-center">
            <MetamaskIcon />
            <span className="mx-4 w-[20%] text-[16px] font-bold text-white">
              Metamask
            </span>
            <Select
              register={register}
              selectOptions={[
                { label: "USDC (ETH)", value: PayinMethodDtoChainEnum.Eth },
                { label: "USDC (AVAX)", value: PayinMethodDtoChainEnum.Avax },
                { label: "USDC (MATIC)", value: PayinMethodDtoChainEnum.Matic }
              ]}
              onChange={async (event: any) => {
                setValue("metamask", event.target.value)
              }}
              name="metamask"
              className="my-4 w-[25%] border-passes-dark-100 bg-transparent"
            />
          </div>
          <Button
            onClick={async () =>
              await setDefaultPayinMethod({
                method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc,
                chain: getValues("metamask")
              })
            }
            tag="button"
            variant="purple-light"
          >
            <span className="font-[700]">Set Default</span>
          </Button>
        </div>
        <div className="flex items-center justify-start">
          <div className="flex flex-1 flex-row items-center">
            <PhantomIcon />
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
              className="my-4 w-[25%] border-passes-dark-100 bg-transparent"
            />
          </div>
          <Button
            onClick={async () =>
              await setDefaultPayinMethod({
                method: PayinMethodDtoMethodEnum.PhantomCircleUsdc,
                chain: getValues("phantom")
              })
            }
            tag="button"
            variant="purple-light"
          >
            <span className="font-[700]">Set Default</span>
          </Button>
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
              addCardHandler
                ? addCardHandler
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
                        await setDefaultPayinMethod({
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
