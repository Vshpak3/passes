import {
  ChannelMemberDto,
  MessageDto,
  PayinMethodDto
} from "@passes/api-client"
import DollarIcon from "public/icons/dollar-rounded-pink.svg"
import React, { Dispatch, FC, SetStateAction, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { BuyMessageButton } from "src/components/molecules/payment/BuyMessageButton"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { Modal } from "src/components/organisms/Modal"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { plural } from "src/helpers/plural"

interface BuyMessageModalProps {
  message: MessageDto
  selectedChannel: ChannelMemberDto
  setMessage: Dispatch<SetStateAction<MessageDto | null>>
}

export const BuyMessageModal: FC<BuyMessageModalProps> = ({
  message,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedChannel,
  setMessage
}) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()

  const { images, video } = contentTypeCounter(message.contents)
  const { price } = message

  return (
    <Modal
      closable={false}
      isOpen
      modalContainerClassname="max-w-[80%] lg:max-w-[30%]"
      setOpen={() => setMessage(null)}
    >
      <SectionTitle>Buy Message</SectionTitle>
      <div>
        <div className="my-4 flex justify-between">
          <span className="flex items-center rounded border border-passes-dark-gray px-2 py-1 text-white">
            {Boolean(video) && `${video} videos`}{" "}
            {Boolean(images) && plural("photo", images)}
          </span>
          <span className="flex items-center text-white">
            Unlock for
            <span className="ml-2 flex items-center rounded bg-passes-primary-color/30 p-2 font-bold">
              <DollarIcon />
              <span className="ml-1">${price?.toFixed(2)}</span>
            </span>
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
      <div className="flex w-full items-center justify-end">
        <Button
          className="mr-8 font-bold text-passes-primary-color"
          onClick={() => setMessage(null)}
        >
          Cancel
        </Button>
        <BuyMessageButton
          messageId={message.messageId}
          onSuccess={() => setMessage(null)}
          payinMethod={payinMethod}
        />
      </div>
    </Modal>
  )
}
