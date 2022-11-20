import {
  PassDto,
  PassDtoTypeEnum,
  PayinMethodDto,
  PayinMethodDtoMethodEnum
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { getPassType } from "src/components/molecules/pass/PassCard"
import { BuyPassButton } from "src/components/molecules/payment/BuyPassButton"
import { NewCard } from "src/components/molecules/payment/NewCard"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymentModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymentModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { Dialog } from "src/components/organisms/Dialog"
import { formatText } from "src/helpers/formatters"
import { useOwnsPass } from "src/hooks/useOwnsPass"

interface BuyPassModalProps {
  pass: PassDto
  setPass: Dispatch<SetStateAction<PassDto | null>>
}

const BuyPassModal: FC<BuyPassModalProps> = ({ pass, setPass }) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()
  const [newCard, setNewCard] = useState<boolean>(false)

  const {
    description,
    title,
    totalMessages,
    price,
    type,
    creatorDisplayName,
    creatorId,
    creatorUsername,
    passId
  } = pass

  const { ownsPass, loading } = useOwnsPass(pass.passId)

  return (
    <Dialog
      className="flex w-full flex-col items-center justify-center border border-white/10 bg-passes-black px-6 py-5 transition-all md:w-[80%] md:rounded-[15px] lg:max-w-[30%]"
      onClose={() => setPass(null)}
      open
    >
      {newCard ? (
        <NewCard callback={() => setNewCard(false)} isEmbedded />
      ) : (
        <>
          <div className="mb-4">
            <PaymentModalHeader
              title={
                "Buy " +
                (type === PassDtoTypeEnum.Lifetime ? "Lifetime" : "Monthly") +
                " Membership"
              }
              user={{
                userId: creatorId ?? "",
                username: creatorUsername ?? "",
                displayName: creatorDisplayName ?? ""
              }}
            />
            <div className="flex justify-center rounded bg-gradient-to-r from-[#46165E] to-passes-tertiary-color py-2 font-bold">
              {title}
            </div>
            <div className="passes-break my-4 whitespace-pre-wrap text-passes-dark-gray">
              {formatText(description)}
            </div>
            <div className="flex flex-row justify-between">
              <span>
                <span className="mr-1 font-bold">
                  {totalMessages ? totalMessages : "Unlimited"}
                </span>
                free messages
              </span>
              <span className="rounded-lg bg-passes-primary-color/30 px-2 py-1 font-bold">
                ${price}
                <span className="px-1">/</span>
                {getPassType(type)}
              </span>
            </div>
          </div>
          {ownsPass && (
            <div className="my-[12px] w-full rounded-[5px] border-[1px] border-[#FF51AB] py-[3px] text-center font-[14px] text-[#FF51AB]">
              You already own this membership.
            </div>
          )}
          <PaymentModalBody
            closeModal={() => setPass(null)}
            price={price ?? 0}
            setNewCard={setNewCard}
            setPayinMethod={setPayinMethod}
          />
          <PaymentModalFooter onClose={() => setPass(null)}>
            <BuyPassButton
              isDisabled={
                loading || payinMethod?.method === PayinMethodDtoMethodEnum.None
              }
              onSuccess={() => {
                setPass(null)
              }}
              passId={passId ?? ""}
              payinMethod={payinMethod}
            />
          </PaymentModalFooter>
        </>
      )}
    </Dialog>
  )
}

export default BuyPassModal // eslint-disable-line import/no-default-export
