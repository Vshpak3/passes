import {
  ChannelMemberDto,
  PayinMethodDto,
  PayinMethodDtoMethodEnum,
  SendMessageRequestDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"

import { NewCard } from "src/components/molecules/payment/NewCard"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymentModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymentModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { TippedMessageButton } from "src/components/molecules/payment/TippedMessageButton"
import { Dialog } from "src/components/organisms/Dialog"

interface TippedMessageModalProps {
  messageRequest: SendMessageRequestDto
  selectedChannel: ChannelMemberDto
  setMessageRequest: Dispatch<SetStateAction<SendMessageRequestDto | null>>
  onSuccess: (() => void) | null
}

const TippedMessageModal: FC<TippedMessageModalProps> = ({
  messageRequest,

  selectedChannel,
  setMessageRequest,
  onSuccess
}) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()
  const [newCard, setNewCard] = useState<boolean>(false)

  const onSuccessHandler = useCallback(() => {
    setMessageRequest(null)
    if (onSuccess) {
      onSuccess()
    }
  }, [onSuccess, setMessageRequest])

  const { otherUserId, otherUserUsername, otherUserDisplayName } =
    selectedChannel

  return (
    <Dialog
      className="flex w-full flex-col items-center justify-center border border-white/10 bg-passes-black px-6 py-5 transition-all md:w-[80%] md:rounded-lg lg:max-w-[30%]"
      onClose={() => setMessageRequest(null)}
      open
    >
      {newCard ? (
        <NewCard callback={() => setNewCard(false)} isEmbedded />
      ) : (
        <>
          <PaymentModalHeader
            title="Tip Message"
            user={{
              userId: otherUserId,
              username: otherUserUsername,
              displayName: otherUserDisplayName
            }}
          />
          <PaymentModalBody
            closeModal={() => setMessageRequest(null)}
            price={messageRequest?.tipAmount ?? 0}
            setNewCard={setNewCard}
            setPayinMethod={setPayinMethod}
          />
          <PaymentModalFooter onClose={() => setMessageRequest(null)}>
            <TippedMessageButton
              isDisabled={payinMethod?.method === PayinMethodDtoMethodEnum.None}
              messageRequest={{ ...messageRequest, payinMethod }}
              onSuccess={onSuccessHandler}
            />
          </PaymentModalFooter>
        </>
      )}
    </Dialog>
  )
}

export default TippedMessageModal // eslint-disable-line import/no-default-export
