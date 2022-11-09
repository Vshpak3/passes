import {
  ChannelMemberDto,
  PayinMethodDto,
  SendMessageRequestDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
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
      <div className="flex w-full items-center justify-end">
        <Button
          className="mr-8 font-bold text-passes-primary-color"
          onClick={() => setMessageRequest(null)}
        >
          Cancel
        </Button>
        <TippedMessageButton
          messageRequest={{ ...messageRequest, payinMethod }}
          onSuccess={onSuccessHandler}
        />
      </div>
    </Modal>
  )
}

export default TippedMessageModal // eslint-disable-line import/no-default-export
