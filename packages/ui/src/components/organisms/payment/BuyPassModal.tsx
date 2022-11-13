import { PassDto, PassDtoTypeEnum, PayinMethodDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useState } from "react"

import { getPassType } from "src/components/molecules/pass/PassCard"
import { BuyPassButton } from "src/components/molecules/payment/BuyPassButton"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymenetModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymenetModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { Modal } from "src/components/organisms/Modal"
import { formatText } from "src/helpers/formatters"
import { useOwnsPass } from "src/hooks/useOwnsPass"

interface BuyPassModalProps {
  pass: PassDto
  setPass: Dispatch<SetStateAction<PassDto | null>>
}

const BuyPassModal: FC<BuyPassModalProps> = ({ pass, setPass }) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()

  const {
    description,
    title,
    totalMessages,
    price,
    type,
    creatorDisplayName,
    creatorId,
    creatorUsername,
    passId
  } = pass

  const { ownsPass, loading } = useOwnsPass(pass.passId)

  return (
    <Modal
      closable={false}
      isOpen
      modalContainerClassname="max-w-[80%] lg:max-w-[30%]"
      setOpen={() => setPass(null)}
    >
      <div className="mb-4">
        <PaymenetModalHeader
          title={
            "Buy " +
            (type === PassDtoTypeEnum.Lifetime ? "Lifetime" : "Monthly") +
            " Membership"
          }
          user={{
            userId: creatorId ?? "",
            username: creatorUsername ?? "",
            displayName: creatorDisplayName ?? ""
          }}
        />
        <div className="flex justify-center rounded bg-gradient-to-r from-[#46165E] to-passes-tertiary-color py-2 font-bold">
          {title}
        </div>
        <div className="my-4 whitespace-pre-wrap text-passes-dark-gray">
          {formatText(description)}
        </div>
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
      {ownsPass && (
        <div className="my-[12px] w-full rounded-[5px] border-[1px] border-[#FF51AB] py-[3px] text-center font-[14px] text-[#FF51AB]">
          You already own this membership.
        </div>
      )}
      <PaymentModalBody
        closeModal={() => setPass(null)}
        price={price ?? 0}
        setPayinMethod={setPayinMethod}
      />
      <PaymenetModalFooter onClose={() => setPass(null)}>
        <BuyPassButton
          isDisabled={loading}
          onSuccess={() => {
            setPass(null)
          }}
          passId={passId ?? ""}
          payinMethod={payinMethod}
        />
      </PaymenetModalFooter>
    </Modal>
  )
}

export default BuyPassModal // eslint-disable-line import/no-default-export
