import { PayinMethodDto, SendMessageRequestDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { TippedMessageButton } from "src/components/molecules/payment/TippedMessageButton"
import { Modal } from "src/components/organisms/Modal"

interface TippedMessageModalProps {
  messageRequest: SendMessageRequestDto
  setMessageRequest: Dispatch<SetStateAction<SendMessageRequestDto | null>>
}

const TippedMessageModal: FC<TippedMessageModalProps> = ({
  messageRequest,
  setMessageRequest
}) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()

  const onSuccessHandler = () => {
    setMessageRequest(null)
  }

  return (
    <Modal isOpen={true} setOpen={() => setMessageRequest(null)}>
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
