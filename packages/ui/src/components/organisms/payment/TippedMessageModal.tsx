import {
  ChannelMemberDto,
  PayinMethodDto,
  SendMessageRequestDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"

import { NewCard } from "src/components/molecules/payment/NewCard"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymentModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymentModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { TippedMessageButton } from "src/components/molecules/payment/TippedMessageButton"
import { Modal } from "src/components/organisms/Modal"

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
    <Modal
      closable={false}
      isOpen
      modalContainerClassname="w-full md:w-[80%] lg:max-w-[30%]"
      setOpen={() => setMessageRequest(null)}
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
              messageRequest={{ ...messageRequest, payinMethod }}
              onSuccess={onSuccessHandler}
            />
          </PaymentModalFooter>
        </>
      )}
    </Modal>
  )
}

export default TippedMessageModal // eslint-disable-line import/no-default-export
