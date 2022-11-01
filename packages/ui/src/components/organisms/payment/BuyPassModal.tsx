import { PassDto, PassDtoTypeEnum } from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction } from "react"

import { BuyPassButton } from "src/components/molecules/payment/BuyPassButton"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { Modal } from "src/components/organisms/Modal"

interface BuyPassModalProps {
  pass: PassDto | null
  setPass: Dispatch<SetStateAction<PassDto | null>>
}

const BuyPassModal: FC<BuyPassModalProps> = ({ pass, setPass }) => {
  return (
    <Modal isOpen={true} setOpen={() => setPass(null)}>
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
        price={pass?.price ?? 0}
        closeModal={() => setPass(null)}
      />

      <BuyPassButton
        passId={pass?.passId ?? ""}
        onSuccess={() => {
          // toast.success("Please wait as we mint your membership card")
          setPass(null)
        }}
      />
    </Modal>
  )
}

export default BuyPassModal // eslint-disable-line import/no-default-export
