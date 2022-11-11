import {
  ChannelMemberDto,
  PayinMethodDto,
  SendMessageRequestDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"

import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymenetModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymenetModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
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
      modalContainerClassname="max-w-[80%] lg:max-w-[30%]"
      setOpen={() => setMessageRequest(null)}
    >
      <PaymenetModalHeader
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
        setPayinMethod={setPayinMethod}
      />
      <PaymenetModalFooter onClose={() => setMessageRequest(null)}>
        <TippedMessageButton
          messageRequest={{ ...messageRequest, payinMethod }}
          onSuccess={onSuccessHandler}
        />
      </PaymenetModalFooter>
    </Modal>
  )
}

export default TippedMessageModal // eslint-disable-line import/no-default-export
