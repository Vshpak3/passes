import { GetPayinMethodResponseDtoMethodEnum } from "@passes/api-client"
import React, { Dispatch, SetStateAction, useState } from "react"
import PayinMethodDisplay from "src/components/molecules/payment/payin-method"
import { TipPostButton } from "src/components/molecules/payment/tip-post-button"
import Modal from "src/components/organisms/Modal"
import { usePayinMethod } from "src/hooks"

interface ITipPostModal {
  postId: string
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

const TipPostModal = ({ postId, setOpen, isOpen }: ITipPostModal) => {
  const { defaultPayinMethod, cards } = usePayinMethod()
  const [amount, setAmount] = useState<number>(0)
  const defaultCard = cards.find(
    (card) => card.id === defaultPayinMethod?.cardId
  )

  const handleChange = (event: any) => {
    const value = event.target.value
    try {
      setAmount(parseInt(value))
    } catch (err) {
      setAmount(0)
    }
  }
  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Tip Post (Minimum $5)
        </span>
      </div>
      <input
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
        type="text"
        onChange={handleChange}
      ></input>
      <div>
        {defaultPayinMethod && (
          <PayinMethodDisplay
            payinMethod={defaultPayinMethod}
            card={defaultCard}
          />
        )}
      </div>
      <TipPostButton
        isDisabled={
          !defaultPayinMethod ||
          defaultPayinMethod.method === GetPayinMethodResponseDtoMethodEnum.None
        }
        postId={postId}
        onSuccess={() => {
          setAmount(0)
          setOpen(false)
        }}
        amount={amount}
      />
    </Modal>
  )
}

export default TipPostModal
