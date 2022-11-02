import { PayinMethodDto, SendMessageRequestDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { TippedMessageButton } from "src/components/molecules/payment/TippedMessageButton"
import { Modal } from "src/components/organisms/Modal"

interface TippedMessageModalProps {
  messageRequest: SendMessageRequestDto
  setMessageRequest: Dispatch<SetStateAction<SendMessageRequestDto | null>>
  onSuccess: (() => void) | null
}

const TippedMessageModal: FC<TippedMessageModalProps> = ({
  messageRequest,
  setMessageRequest,
  onSuccess
}) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()

  const onSuccessHandler = () => {
    setMessageRequest(null)
    if (onSuccess) {
      onSuccess
    }
  }

  return (
    <Modal isOpen setOpen={() => setMessageRequest(null)}>
      <PaymentModalBody
        price={messageRequest?.price ?? 0}
        closeModal={() => setMessageRequest(null)}
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
