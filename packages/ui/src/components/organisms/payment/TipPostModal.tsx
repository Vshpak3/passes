import {
  GetPayinMethodResponseDtoMethodEnum,
  PayinDataDto,
  PostApi,
  PostDto
} from "@passes/api-client"
import { FC } from "react"
import { useForm } from "react-hook-form"

import { Input } from "src/components/atoms/Input"
import { PayinMethodDisplay } from "src/components/molecules/payment/PayinMethodDisplay"
import { TipPostButton } from "src/components/molecules/payment/TipPostButton"
import { Modal, ModalProps } from "src/components/organisms/Modal"
import { usePay } from "src/hooks/usePay"
import { usePayinMethod } from "src/hooks/usePayinMethod"

interface TipPostModalProps extends ModalProps {
  postId: PostDto["postId"]
}

const TipPostModal: FC<TipPostModalProps> = ({ isOpen, setOpen, postId }) => {
  const { defaultPayinMethod, defaultCard } = usePayinMethod()

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<{
    "tip-value": number
  }>()
  const api = new PostApi()
  const registerTip = async () => {
    return await api.registerTipPost({
      tipPostRequestDto: {
        postId: postId,
        amount: Number(getValues("tip-value"))
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
            closeModal={() => setOpen(false)}
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

export default TipPostModal // eslint-disable-line import/no-default-export
