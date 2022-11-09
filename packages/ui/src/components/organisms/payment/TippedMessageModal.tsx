import {
  ChannelMemberDto,
  PayinMethodDto,
  SendMessageRequestDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"

import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymenetModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  return (
    <Modal
      closable={false}
      isOpen
      modalContainerClassname="max-w-[80%] lg:max-w-[30%]"
      setOpen={() => setMessageRequest(null)}
    >
      <PaymentModalBody
        closeModal={() => setMessageRequest(null)}
        price={messageRequest?.price ?? 0}
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
