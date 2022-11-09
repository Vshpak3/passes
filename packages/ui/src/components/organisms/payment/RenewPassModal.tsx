import {
  GetPayinMethodResponseDtoMethodEnum,
  PassHolderDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction } from "react"

import { getPassType } from "src/components/molecules/pass/PassCard"
import { PayinMethodDisplay } from "src/components/molecules/payment/PayinMethodDisplay"
import { PaymenetModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymenetModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { RenewPassButton } from "src/components/molecules/payment/RenewPassButton"
import { Modal } from "src/components/organisms/Modal"
import { usePayinMethod } from "src/hooks/usePayinMethod"

interface RenewPassModalProps {
  passHolder: PassHolderDto
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RenewPassModal: FC<RenewPassModalProps> = ({
  passHolder,
  setOpen,
  isOpen
}) => {
  const { defaultPayinMethod, defaultCard } = usePayinMethod()

  const {
    creatorId,
    creatorDisplayName,
    creatorUsername,
    title,
    description,
    totalMessages,
    price,
    type,
    passHolderId
  } = passHolder

  return (
    <Modal
      closable={false}
      isOpen={isOpen}
      modalContainerClassname="max-w-[80%] lg:max-w-[30%]"
      setOpen={setOpen}
    >
      <div className="mb-4">
        <PaymenetModalHeader
          title="Renew Pass"
          user={{
            userId: creatorId ?? "",
            username: creatorUsername ?? "",
            displayName: creatorDisplayName ?? ""
          }}
        />
        <div className="flex justify-center rounded bg-gradient-to-r from-[#46165E] to-passes-tertiary-color py-2 font-bold">
          {title}
        </div>
        <div className="my-4 text-passes-dark-gray">{description}</div>
        <div className="flex flex-row justify-between">
          <span>
            <span className="mr-1 font-bold">
              {totalMessages ? totalMessages : "Unlimited"}
            </span>
            free messages
          </span>
          <span className="rounded-lg bg-passes-primary-color/30 px-2 py-1 font-bold">
            ${price}
            <span className="px-1">/</span>
            {getPassType(type)}
          </span>
        </div>
      </div>
      <div>
        {defaultPayinMethod && (
          <PayinMethodDisplay
            card={defaultCard}
            closeModal={() => setOpen(false)}
            payinMethod={defaultPayinMethod}
          />
        )}
      </div>
      <PaymenetModalFooter onClose={() => setOpen(false)}>
        <RenewPassButton
          isDisabled={
            !defaultPayinMethod ||
            defaultPayinMethod.method ===
              GetPayinMethodResponseDtoMethodEnum.None
          }
          onSuccess={() => setOpen(false)}
          passHolderId={passHolderId}
        />
      </PaymenetModalFooter>
    </Modal>
  )
}
