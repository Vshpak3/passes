import {
  ChannelMemberDto,
  PayinMethodDto,
  SendMessageRequestDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"

import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
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
      isOpen
      modalContainerClassname="max-w-[500px]"
      setOpen={() => setMessageRequest(null)}
    >
      <PaymentModalBody
        closeModal={() => setMessageRequest(null)}
        price={messageRequest?.price ?? 0}
        setPayinMethod={setPayinMethod}
      />
      <TippedMessageButton
        messageRequest={{ ...messageRequest, payinMethod }}
        onSuccess={onSuccessHandler}
      />
    </Modal>
  )
}

export default TippedMessageModal // eslint-disable-line import/no-default-export
