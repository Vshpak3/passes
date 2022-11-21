import {
  ChannelMemberDto,
  MessageDto,
  PayinMethodDto,
  PayinMethodDtoMethodEnum
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { BuyMessageButton } from "src/components/molecules/payment/BuyMessageButton"
import { NewCard } from "src/components/molecules/payment/NewCard"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymentModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymentModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { Dialog } from "src/components/organisms/Dialog"
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
    <Dialog
      className="flex w-[600px] max-w-full flex-col items-center justify-center rounded-[5px] border border-white/10 bg-passes-black px-6 py-5 transition-all"
      onClose={() => setMessage(null)}
      open
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
              <span className="flex items-center rounded border border-passes-dark-gray px-2 py-1 text-white">
                <UnlockText images={images} showUnlock={false} videos={video} />
              </span>
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
              isDisabled={payinMethod?.method === PayinMethodDtoMethodEnum.None}
              messageId={message.messageId}
              onSuccess={() => setMessage(null)}
              payinMethod={payinMethod}
            />
          </PaymentModalFooter>
        </>
      )}
    </Dialog>
  )
}
