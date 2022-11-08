import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import ms from "ms"
import CardIcon from "public/icons/bank-card.svg"
import DeleteIcon from "public/icons/delete-outline.svg"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { toast } from "react-toastify"

import { Button } from "src/components/atoms/button/Button"
import { DeleteConfirmationModal } from "src/components/molecules/DeleteConfirmationModal"
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
  const [cardIdDelete, setCardIdDelete] = useState<string | null>(null)

  const { cards, defaultPayinMethod, getDefaultPayinMethod, deleteCard } =
    usePayinMethod(true, ms("5 seconds"))

  return (
    <div className="mt-8 flex flex-col">
      <h3 className="text-[18px] font-bold text-white">
        Add Card as a Payment Method
      </h3>
      <div className="w-[130px]">
        <Button
          className="mt-5 mb-6 rounded-md"
          icon={
            <div className="mr-2">
              <CardIcon />
            </div>
          }
          onClick={
            isEmbedded
              ? () => setOpen(true)
              : () => addOrPopStackHandler(SubTabsEnum.AddCard)
          }
          variant="pink"
        >
          Add Card
        </Button>
      </div>
      <div>
        {cards?.map((item) => (
          <div
            className="my-5 flex rounded-[15px] border border-passes-dark-200 bg-[#12070E]/50 bg-[#18090E] p-5"
            key={item.id}
          >
            <CreditCardEntry card={item} showName />
            <div className="flex flex-row gap-2 md:gap-4">
              <div>
                {item.id === defaultPayinMethod?.cardId ? (
                  <Button variant="gray">
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
                    variant="purple-light"
                  >
                    <span className="font-[700]">{buttonName(isEmbedded)}</span>
                  </Button>
                )}
              </div>
              <button
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/10"
                onClick={() => setCardIdDelete(item.id)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      {!!cardIdDelete && (
        <DeleteConfirmationModal
          isOpen={!!cardIdDelete}
          onClose={() => setCardIdDelete(null)}
          onDelete={async () => {
            await deleteCard(cardIdDelete)
            toast.success("Card has been removed")
            getDefaultPayinMethod()
          }}
        />
      )}
    </div>
  )
}
