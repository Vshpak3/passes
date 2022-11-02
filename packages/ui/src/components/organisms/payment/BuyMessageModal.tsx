import { MessageDto, PayinMethodDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction, useState } from "react"

import { BuyMessageButton } from "src/components/molecules/payment/BuyMessageButton"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { Modal } from "src/components/organisms/Modal"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { plural } from "src/helpers/plural"

interface BuyMessageModalProps {
  message: MessageDto
  setMessage: Dispatch<SetStateAction<MessageDto | null>>
}

export const BuyMessageModal: FC<BuyMessageModalProps> = ({
  message,
  setMessage
}) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()

  const { images, video } = contentTypeCounter(message.contents)

  return (
    <Modal isOpen setOpen={() => setMessage(null)}>
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
        <PaymentModalBody
          closeModal={() => setMessage(null)}
          price={message?.price ?? 0}
          setPayinMethod={setPayinMethod}
        />
      </div>
      <BuyMessageButton
        messageId={message.messageId}
        onSuccess={() => setMessage(null)}
        payinMethod={payinMethod}
      />
    </Modal>
  )
}
