import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import CardIcon from "public/icons/bank-card.svg"
import DeleteIcon from "public/icons/delete-outline.svg"
import { Dispatch, FC, SetStateAction } from "react"

import { Button } from "src/components/atoms/Button"
import { SubTabsEnum } from "src/config/settings"
import { usePayinMethod } from "src/hooks/usePayinMethod"
import { CreditCardEntry } from "./CreditCardEntry"
import { buttonName } from "./PaymentSettingsCrypto"

interface PaymentSettingsCreditCardProps {
  isEmbedded: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  addOrPopStackHandler: (tab: SubTabsEnum) => void
  handleSetDefaultPayInMethod: (value: PayinMethodDto) => Promise<void>
}

export const PaymentSettingsCreditCard: FC<PaymentSettingsCreditCardProps> = ({
  isEmbedded,
  setOpen,
  addOrPopStackHandler,
  handleSetDefaultPayInMethod
}) => {
  const { cards, defaultPayinMethod, getDefaultPayinMethod, deleteCard } =
    usePayinMethod()

  return (
    <div className="mt-8 flex flex-col">
      <span className="text-[18px] font-bold text-white">
        Use Card as a Payment Method
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
        {cards?.map((item) => (
          <div
            key={item.id}
            className="my-5 flex rounded-[15px] border border-passes-dark-200 bg-[#1B141D]/50 p-5"
          >
            <CreditCardEntry card={item} showName={true} />
            <div className="flex flex-row gap-2 md:gap-4">
              <div>
                {item.id === defaultPayinMethod?.cardId ? (
                  <Button tag="button" variant="gray">
                    <span className="text-[14px] font-[700]">
                      {isEmbedded ? "Selected" : "Default"}
                    </span>
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
                    <span className="font-[700]">{buttonName(isEmbedded)}</span>
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
  )
}
