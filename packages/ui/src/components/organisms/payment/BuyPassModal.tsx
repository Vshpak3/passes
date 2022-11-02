import { PassDto, PassDtoTypeEnum, PayinMethodDto } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction, useState } from "react"

import { BuyPassButton } from "src/components/molecules/payment/BuyPassButton"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { Modal } from "src/components/organisms/Modal"

interface BuyPassModalProps {
  pass: PassDto | null
  setPass: Dispatch<SetStateAction<PassDto | null>>
}

const BuyPassModal: FC<BuyPassModalProps> = ({ pass, setPass }) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()
  return (
    <Modal isOpen setOpen={() => setPass(null)}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Buy{" "}
          {pass?.type === PassDtoTypeEnum.Lifetime
            ? "Lifetime"
            : "Subscription"}{" "}
          Pass
        </span>
        <span className="text-white">
          ${pass?.price.toFixed(2)}
          {pass?.duration ? "/30 days" : ""}
        </span>
      </div>
      <PaymentModalBody
        closeModal={() => setPass(null)}
        price={pass?.price ?? 0}
        setPayinMethod={setPayinMethod}
      />

      <BuyPassButton
        onSuccess={() => {
          // toast.success("Please wait as we mint your membership card")
          setPass(null)
        }}
        passId={pass?.passId ?? ""}
        payinMethod={payinMethod}
      />
    </Modal>
  )
}

export default BuyPassModal // eslint-disable-line import/no-default-export
