import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import { useRouter } from "next/router"
import AmexCardIcon from "public/icons/amex-icon.svg"
import CardIcon from "public/icons/bank-card.svg"
import DeleteIcon from "public/icons/delete-outline.svg"
import DiscoverCardIcon from "public/icons/discover-icon.svg"
import MasterCardIcon from "public/icons/mastercard-icon.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import VisaIcon from "public/icons/visa-icon.svg"
import { useEffect } from "react"
import { Button } from "src/components/atoms"
import { usePayment, useUser } from "src/hooks"

import { SubTabsEnum } from "../../../../../../config/settings"
import {
  ISettingsContext,
  useSettings
} from "../../../../../../contexts/settings"
import Tab from "../../../Tab"

const ManageCard = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext

  const {
    cards,
    setDefaultPayinMethod,
    defaultPayinMethod: defaultPayin,
    deleteCard
  } = usePayment()

  const filteredDefaultPayment = cards.find(
    (card) => card.id === defaultPayin?.cardId
  )

  const { user, loading } = useUser()
  const router = useRouter()

  const setDefaultPayin = async (dto: PayinMethodDto) => {
    setDefaultPayinMethod(dto)
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])

  const displayCardIcon = (cardDigit: string) => {
    switch (cardDigit) {
      case "4":
        return <VisaIcon width={25} height={25} />
      case "5":
        return <MasterCardIcon width={25} height={25} />
      case "3":
        return <AmexCardIcon width={25} height={25} />
      case "6":
        return <DiscoverCardIcon width={25} height={25} />
      default:
        return null
    }
  }
  return (
    <Tab
      title="Manage Payment Method"
      TitleBtn={
        <Button
          icon={<CardIcon />}
          variant="purple-light"
          tag="button"
          className="!px-6 !py-2.5 font-medium"
          onClick={() => addTabToStackHandler(SubTabsEnum.AddCard)}
        >
          Add New Payment Method
        </Button>
      }
      withBack
    >
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <div
            key={item.id}
            className="m-2 flex h-[227px] w-[248px] flex-col justify-between gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-4"
          >
            <span className="text-[24px] font-[700]">{item.name}</span>
            {!item.fourDigits ? (
              <div className="flex items-center gap-4">
                <MetamaskIcon width={50} height={50} />
                <span className="text-[12px] font-[500]">
                  Ac8ubdjd...dthjssBIPis9
                </span>
              </div>
            ) : (
              <>
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
                  {displayCardIcon(item.firstDigit)}
                </div>
              </>
            )}
            <div className="flex flex-row gap-4">
              {item.id === filteredDefaultPayment?.id ? (
                <button className="flex h-[44px] flex-1 shrink-0 items-center justify-center gap-2 rounded-full border border-passes-dark-200 bg-black px-2 text-white">
                  <span className="text-[14px] font-[700]">Default</span>
                </button>
              ) : (
                <button
                  onClick={() =>
                    setDefaultPayin({
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
                onClick={() => deleteCard(item.id)}
                className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/10"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Tab>
  )
}

export default ManageCard
