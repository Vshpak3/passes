import {
  GetPayinMethodResponseDtoMethodEnum,
  PassDto,
  PassDtoTypeEnum
} from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction } from "react"
import { BuyPassButton } from "src/components/molecules/payment/buy-pass-button"
import { PayinMethodDisplay } from "src/components/molecules/payment/payin-method"
import { Modal } from "src/components/organisms/Modal"
import { usePayinMethod } from "src/hooks/usePayinMethod"

interface BuyMessageModalProps {
  pass: PassDto
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

export const BuyPostModal: FC<BuyMessageModalProps> = ({
  pass,
  setOpen,
  isOpen
}) => {
  const { defaultPayinMethod, defaultCard } = usePayinMethod()

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Buy{" "}
          {pass.type === PassDtoTypeEnum.Lifetime ? "Lifetime" : "Subscription"}{" "}
          Pass
        </span>
        <span className="text-white">
          ${pass.price.toFixed(2)}
          {pass.duration ? "/30 days" : ""}
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
      {defaultPayinMethod?.cardId && (
        <div>
          Buying an nft with a credit card requires 3DS authentication. You may
          be redirected shortly after paying to confirm the transaction.
        </div>
      )}
      <BuyPassButton
        isDisabled={
          !defaultPayinMethod ||
          defaultPayinMethod.method === GetPayinMethodResponseDtoMethodEnum.None
        }
        passId={pass.passId}
        onSuccess={() => setOpen(false)}
      />
    </Modal>
  )
}
