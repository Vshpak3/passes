import {
  GetPayinMethodResponseDtoMethodEnum,
  PassHolderDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction } from "react"
import { PayinMethodDisplay } from "src/components/molecules/payment/PayinMethodDisplay"
import { RenewPassButton } from "src/components/molecules/payment/RenewPassButton"
import { Modal } from "src/components/organisms/Modal"
import { usePayinMethod } from "src/hooks/usePayinMethod"

interface RenewPassModalProps {
  passHolder: PassHolderDto
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

export const RenewPassModal: FC<RenewPassModalProps> = ({
  passHolder,
  setOpen,
  isOpen
}) => {
  const { defaultPayinMethod, defaultCard } = usePayinMethod()

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Renew Pass
        </span>
        <span className="text-white">
          ${passHolder.price.toFixed(2)}
          {passHolder.duration ? "/30 days" : ""}
        </span>
      </div>
      <div>
        {defaultPayinMethod && (
          <PayinMethodDisplay
            payinMethod={defaultPayinMethod}
            card={defaultCard}
          />
        )}
      </div>
      <RenewPassButton
        isDisabled={
          !defaultPayinMethod ||
          defaultPayinMethod.method === GetPayinMethodResponseDtoMethodEnum.None
        }
        passHolderId={passHolder.passHolderId}
        onSuccess={() => setOpen(false)}
      />
    </Modal>
  )
}
