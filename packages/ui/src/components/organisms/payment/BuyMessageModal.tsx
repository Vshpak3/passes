import {
  ChannelMemberDto,
  MessageDto,
  PayinMethodDto
} from "@passes/api-client"
import DollarIcon from "public/icons/dollar-rounded-pink.svg"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { BuyMessageButton } from "src/components/molecules/payment/BuyMessageButton"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymenetModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymenetModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { Modal } from "src/components/organisms/Modal"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { formatCurrency } from "src/helpers/formatters"
import { plural } from "src/helpers/plural"

interface BuyMessageModalProps {
  message: MessageDto
  selectedChannel: ChannelMemberDto
  setMessage: Dispatch<SetStateAction<MessageDto | null>>
}

export const BuyMessageModal: FC<BuyMessageModalProps> = ({
  message,

  selectedChannel,
  setMessage
}) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()

  const { images, video } = contentTypeCounter(message.contents)
  const { price } = message
  const { otherUserId, otherUserUsername, otherUserDisplayName } =
    selectedChannel

  return (
    <Modal
      closable={false}
      isOpen
      modalContainerClassname="max-w-[80%] lg:max-w-[30%]"
      setOpen={() => setMessage(null)}
    >
      <PaymenetModalHeader
        title="Buy Message"
        user={{
          userId: otherUserId,
          username: otherUserUsername,
          displayName: otherUserDisplayName
        }}
      />
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
              <span className="ml-1">{formatCurrency(price)}</span>
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
      <PaymenetModalFooter onClose={() => setMessage(null)}>
        <BuyMessageButton
          messageId={message.messageId}
          onSuccess={() => setMessage(null)}
          payinMethod={payinMethod}
        />
      </PaymenetModalFooter>
    </Modal>
  )
}
