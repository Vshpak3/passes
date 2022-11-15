import {
  ChannelMemberDto,
  MessageDto,
  PayinMethodDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { BuyMessageButton } from "src/components/molecules/payment/BuyMessageButton"
import { NewCard } from "src/components/molecules/payment/NewCard"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymentModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymentModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { Modal } from "src/components/organisms/Modal"
import { UnlockText } from "src/components/organisms/UnlockText"
import { contentTypeCounter } from "src/helpers/contentTypeCounter"
import { formatCurrency } from "src/helpers/formatters"

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
  const [newCard, setNewCard] = useState<boolean>(false)

  const { images, video } = contentTypeCounter(message.contents)
  const { otherUserId, otherUserUsername, otherUserDisplayName } =
    selectedChannel

  return (
    <Modal
      closable={false}
      isOpen
      modalContainerClassname="w-full md:w-[80%] lg:max-w-[30%]"
      setOpen={() => setMessage(null)}
    >
      {newCard ? (
        <NewCard callback={() => setNewCard(false)} isEmbedded />
      ) : (
        <>
          <PaymentModalHeader
            title="Buy Message"
            user={{
              userId: otherUserId,
              username: otherUserUsername,
              displayName: otherUserDisplayName
            }}
          />
          <div>
            <div className="my-4 flex justify-between">
              <UnlockText
                className="flex items-center rounded border border-passes-dark-gray px-2 py-1 text-white"
                images={images}
                showUnlock={false}
                videos={video}
              />
              <span className="flex items-center text-white">
                Unlock for
                <span className="ml-3 flex items-center rounded bg-passes-primary-color/30 py-2 px-3 font-bold">
                  {formatCurrency(message.price)}
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
              setNewCard={setNewCard}
              setPayinMethod={setPayinMethod}
            />
          </div>
          <PaymentModalFooter onClose={() => setMessage(null)}>
            <BuyMessageButton
              messageId={message.messageId}
              onSuccess={() => setMessage(null)}
              payinMethod={payinMethod}
            />
          </PaymentModalFooter>
        </>
      )}
    </Modal>
  )
}
