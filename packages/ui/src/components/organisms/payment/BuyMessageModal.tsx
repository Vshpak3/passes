import {
  GetPayinMethodResponseDtoMethodEnum,
  MessageDto
} from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction } from "react"
import { BuyMessageButton } from "src/components/molecules/payment/buy-message-button"
import { PayinMethodDisplay } from "src/components/molecules/payment/payin-method"
import { Modal } from "src/components/organisms/Modal"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { plural } from "src/helpers/plural"
import { usePayinMethod } from "src/hooks/usePayinMethod"

interface BuyMessageModalProps {
  message: MessageDto
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

export const BuyMessageModal: FC<BuyMessageModalProps> = ({
  message,
  setOpen,
  isOpen
}) => {
  const { defaultPayinMethod, defaultCard } = usePayinMethod()

  const { images, video } = contentTypeCounter(message.contents)

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Buy Message
        </span>
        <span className="text-white">${message.price.toFixed(2)}</span>
      </div>
      <div>
        <div className="my-4">
          <span className="text-[#ffff]/70">
            {!!video && `${video} videos`} {!!images && plural("photo", images)}
          </span>
        </div>
        <div>
          <span className="text-[#ffff]/90">
            This content will be unlocked and available in the chat and gallery
            after purchase.
          </span>
        </div>
        {defaultPayinMethod && (
          <PayinMethodDisplay
            payinMethod={defaultPayinMethod}
            card={defaultCard}
            closeModal={() => {
              setOpen(false)
            }}
          />
        )}
      </div>
      <BuyMessageButton
        isDisabled={
          !defaultPayinMethod ||
          defaultPayinMethod.method === GetPayinMethodResponseDtoMethodEnum.None
        }
        messageId={message.messageId}
        onSuccess={() => setOpen(false)}
      />
    </Modal>
  )
}
