import {
  GetPayinMethodResponseDtoMethodEnum,
  PassHolderDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { getPassType } from "src/components/molecules/pass/PassCard"
import { NewCard } from "src/components/molecules/payment/NewCard"
import { PayinMethodDisplay } from "src/components/molecules/payment/PayinMethodDisplay"
import { PaymentModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymentModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { RenewPassButton } from "src/components/molecules/payment/RenewPassButton"
import { Dialog } from "src/components/organisms/Dialog"
import { usePayinMethod } from "src/hooks/usePayinMethod"

interface RenewPassModalProps {
  passHolder: PassHolderDto
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RenewPassModal: FC<RenewPassModalProps> = ({
  passHolder,
  setOpen,
  isOpen
}) => {
  const { defaultPayinMethod, defaultCard } = usePayinMethod()
  const [newCard, setNewCard] = useState<boolean>(false)

  const {
    creatorId,
    creatorDisplayName,
    creatorUsername,
    title,
    description,
    totalMessages,
    price,
    type,
    passHolderId
  } = passHolder

  return (
    <Dialog
      className="flex w-[600px] max-w-full flex-col items-center justify-center rounded-[5px] border border-white/10 bg-passes-black px-6 py-5 transition-all"
      onClose={() => setOpen(false)}
      open={isOpen}
    >
      {newCard ? (
        <NewCard callback={() => setNewCard(false)} isEmbedded />
      ) : (
        <>
          <div className="mb-4">
            <PaymentModalHeader
              title="Renew Pass"
              user={{
                userId: creatorId ?? "",
                username: creatorUsername ?? "",
                displayName: creatorDisplayName ?? ""
              }}
            />
            <div className="flex justify-center rounded bg-gradient-to-r from-[#46165E] to-passes-tertiary-color py-2 font-bold">
              {title}
            </div>
            <div className="my-4 text-passes-dark-gray">{description}</div>
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
          <div>
            {defaultPayinMethod && (
              <PayinMethodDisplay
                card={defaultCard}
                closeModal={() => setOpen(false)}
                payinMethod={defaultPayinMethod}
              />
            )}
          </div>
          <PaymentModalFooter onClose={() => setOpen(false)}>
            <RenewPassButton
              isDisabled={
                !defaultPayinMethod ||
                defaultPayinMethod.method ===
                  GetPayinMethodResponseDtoMethodEnum.None
              }
              onSuccess={() => setOpen(false)}
              passHolderId={passHolderId}
            />
          </PaymentModalFooter>
        </>
      )}
    </Dialog>
  )
}
