import {
  GetPayinMethodResponseDtoMethodEnum,
  PassHolderDto
} from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction } from "react"
import PayinMethodDisplay from "src/components/molecules/payment/payin-method"
import { RenewPassButton } from "src/components/molecules/payment/renew-pass-button"
import Modal from "src/components/organisms/Modal"
import { usePayinMethod } from "src/hooks"

interface IBuyMessageModal {
  passHolder: PassHolderDto
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

const BuyPostModal: FC<IBuyMessageModal> = ({
  passHolder,
  setOpen,
  isOpen
}) => {
  const { defaultPayinMethod, cards } = usePayinMethod()
  const defaultCard = cards.find(
    (card) => card.id === defaultPayinMethod?.cardId
  )

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Renew Pass
        </span>
        <span className="text-white">
          ${passHolder.price.toFixed(2)}
          {passHolder.duration ? "/30 days" : ""}
        </span>
      </div>
      <div>
        {defaultPayinMethod && (
          <PayinMethodDisplay
            payinMethod={defaultPayinMethod}
            card={defaultCard}
          />
        )}
      </div>
      <RenewPassButton
        isDisabled={
          !defaultPayinMethod ||
          defaultPayinMethod.method === GetPayinMethodResponseDtoMethodEnum.None
        }
        passHolderId={passHolder.passHolderId}
        onSuccess={() => setOpen(false)}
      />
    </Modal>
  )
}

export default BuyPostModal
