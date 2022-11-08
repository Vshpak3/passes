import { MessageDto, PayinMethodDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction, useState } from "react"

import { SectionTitle } from "src/components/atoms/SectionTitle"
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
    <Modal
      isOpen
      modalContainerClassname="lg:max-w-[30%] p-4"
      setOpen={() => setMessage(null)}
    >
      <SectionTitle>Buy Message</SectionTitle>
      <div>
        <div className="my-4 flex justify-between">
          <span className="rounded border border-passes-dark-gray px-2 py-1 text-white">
            {!!video && `${video} videos`} {!!images && plural("photo", images)}
          </span>
          <span className="text-white">
            Unlock for ${message.price.toFixed(2)}
          </span>
        </div>
        <span className="my-4 flex text-passes-dark-gray">
          This content will be unlocked and available in the messaging chat
          purchase.
        </span>
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
