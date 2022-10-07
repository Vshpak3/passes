import {
  GetPayinMethodResponseDtoMethodEnum,
  PayinDataDto,
  PostApi
} from "@passes/api-client"
import React, { Dispatch, FC, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { Input } from "src/components/atoms"
import PayinMethodDisplay from "src/components/molecules/payment/payin-method"
import { TipPostButton } from "src/components/molecules/payment/tip-post-button"
import Modal from "src/components/organisms/Modal"
import { usePayinMethod } from "src/hooks"
import { usePay } from "src/hooks/usePay"

interface TipPostModalProps {
  postId: string
  setOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

const TipPostModal: FC<TipPostModalProps> = ({ postId, setOpen, isOpen }) => {
  const { defaultPayinMethod, cards } = usePayinMethod()
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<{
    "tip-value": number
  }>()
  const defaultCard = cards.find(
    (card) => card.id === defaultPayinMethod?.cardId
  )

  const api = new PostApi()
  const registerTip = async () => {
    return await api.registerTipPost({
      tipPostRequestDto: {
        postId,
        amount: Number(getValues("tip-value")),
        payinMethod: defaultPayinMethod
      }
    })
  }

  const registerData = async () => {
    return {
      blocked: undefined,
      amount: Number(getValues("tip-value"))
    } as PayinDataDto
  }

  const onSuccess = () => {
    setOpen(false)
  }

  const { loading, submit } = usePay(registerTip, registerData, onSuccess)

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Tip Post (Minimum $5)
        </span>
      </div>
      <Input
        className="border-passes-dark-100 bg-transparent"
        register={register}
        name="tip-value"
        errors={errors}
        type="number"
        options={{
          required: { message: "Tip amount is required", value: true },
          min: { value: 5, message: "Tip must be more than $5" }
        }}
      />
      <div className="my-8">
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
          defaultPayinMethod.method ===
            GetPayinMethodResponseDtoMethodEnum.None ||
          isSubmitSuccessful
        }
        onClick={handleSubmit(submit)}
        isLoading={loading}
      />
    </Modal>
  )
}

export default TipPostModal
