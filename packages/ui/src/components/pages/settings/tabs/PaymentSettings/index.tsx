import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { Menu, Transition } from "@headlessui/react"
import {
  PayinMethodDtoChainEnum,
  PayinMethodDtoMethodEnum
} from "@passes/api-client"
import { useRouter } from "next/router"
import CardIcon from "public/icons/bank-card.svg"
import DeleteIcon from "public/icons/delete-outline.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { Fragment, useEffect } from "react"
import { Button } from "src/components/atoms"
import Tab from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import { displayCardIcon } from "src/helpers/payment/paymentMethod"
import { usePayinMethod, useUser } from "src/hooks"
import ChevronDown from "src/icons/chevron-down"

const PaymentSettings = () => {
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
      <Tab withBackMobile title="Payment Settings" />

      <div className="my-8 flex flex-col gap-6 xl:flex-row">
        <div className="flex  w-[248px] flex-col justify-center gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-6">
          <span className="text-[14px] font-[400] opacity-90">
            Default Payment Method:
          </span>
          <span className="text-[16px] font-[700]">
            {defaultPayinMethod?.method ?? "no payin method"}
            <br />
            {defaultPayinMethod?.chain}
          </span>
          {defaultCard && (
            <div className="flex gap-6">
              <span className="text-[14px] font-[500] opacity-70">
                *******{defaultCard.fourDigits}
              </span>
              {displayCardIcon(defaultCard.firstDigit, 25)}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <div
          className={"flex h-[72px] items-center justify-center text-[#B8B8B8]"}
        >
          <MetamaskIcon className="stroke-passes-pink-100 stroke-2" />
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
              <div className="flex h-[45px] cursor-pointer flex-row items-center gap-4 rounded-[6px] border border-passes-dark-100 bg-transparent p-4 text-[#ffff]/90">
                <span className="text-[16px] font-[400] opacity-[0.5]">
                  Select Type
                </span>
                <ChevronDown />
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 z-10 mt-2 flex origin-top-right flex-col justify-center gap-4 rounded-[20px] border border-passes-dark-100 bg-black p-5 text-center shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="flex flex-row items-center justify-between">
                  <button
                    onClick={async () => {
                      await setDefaultPayinMethod({
                        method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc,
                        chain: PayinMethodDtoChainEnum.Eth
                      })
                    }}
                  >
                    USDC ETH
                  </button>
                  <button
                    onClick={async () => {
                      await setDefaultPayinMethod({
                        method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc,
                        chain: PayinMethodDtoChainEnum.Avax
                      })
                    }}
                  >
                    USDC AVAX
                  </button>
                  <button
                    onClick={async () => {
                      await setDefaultPayinMethod({
                        method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc,
                        chain: PayinMethodDtoChainEnum.Matic
                      })
                    }}
                  >
                    USDC MATIC (Polygon)
                  </button>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <div
          className={
            " flex h-[72px] items-center justify-center text-[#B8B8B8]"
          }
        >
          <PhantomIcon className="stroke-passes-pink-100 stroke-2" />
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button>
              <div className="flex h-[45px] cursor-pointer flex-row items-center gap-4 rounded-[6px] border border-passes-dark-100 bg-transparent p-4 text-[#ffff]/90">
                <span className="text-[16px] font-[400] opacity-[0.5]">
                  Select Type
                </span>
                <ChevronDown />
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 z-10 mt-2 flex origin-top-right flex-col justify-center gap-4 rounded-[20px] border border-passes-dark-100 bg-black p-5 text-center shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="flex flex-row items-center justify-between">
                  <button
                    onClick={async () => {
                      await setDefaultPayinMethod({
                        method: PayinMethodDtoMethodEnum.PhantomCircleUsdc,
                        chain: PayinMethodDtoChainEnum.Sol
                      })
                    }}
                  >
                    USDC SOL
                  </button>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          <Button
            icon={<CardIcon />}
            variant="purple-light"
            tag="button"
            className="!px-4 !py-2.5"
            onClick={() => addOrPopStackHandler(SubTabsEnum.AddCard)}
          >
            Add card
          </Button>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <div
            key={item.id}
            className="m-2 flex h-[227px] w-[248px] flex-col justify-between gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-4"
          >
            <span className="text-[24px] font-[700]">{item.name}</span>
            <span className="text-[12px] font-[500]">
              **** **** **** {item.fourDigits}
            </span>
            <div className="mr-1 flex flex-row justify-between">
              <div className="flex items-center">
                <div className="flex flex-col ">
                  <span className="-mb-2 w-8 text-[10px] font-[500] opacity-70">
                    VALID
                  </span>
                  <span className="w-8 text-[10px] font-[500] opacity-70">
                    THRU
                  </span>
                </div>
                <span className="text-[12px] font-[500]">
                  {item.expMonth}/{item.expYear.toString().slice(-2)}
                </span>
              </div>
              {displayCardIcon(item.firstDigit, 25)}
            </div>
            <div className="flex flex-row gap-4">
              {item.id === defaultPayinMethod?.cardId ? (
                <button className="flex h-[44px] flex-1 shrink-0 items-center justify-center gap-2 rounded-full border border-passes-dark-200 bg-black px-2 text-white">
                  <span className="text-[14px] font-[700]">Default</span>
                </button>
              ) : (
                <button
                  onClick={async () =>
                    await setDefaultPayinMethod({
                      cardId: item.id,
                      method: PayinMethodDtoMethodEnum.CircleCard
                    })
                  }
                  className="flex h-[44px] flex-1 shrink-0 items-center justify-center gap-2 rounded-full border border-passes-primary-color bg-passes-primary-color px-2 text-white"
                >
                  <span className="text-[14px] font-[700]">Set Default</span>
                </button>
              )}
              <button
                onClick={() => {
                  deleteCard(item.id)
                  getDefaultPayinMethod
                }}
                className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/10"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default PaymentSettings
