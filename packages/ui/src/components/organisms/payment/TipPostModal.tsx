import {
  PayinDataDto,
  PayinMethodDto,
  PostApi,
  PostDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"

import { NumberInput } from "src/components/atoms/input/NumberInput"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { TipPostButton } from "src/components/molecules/payment/TipPostButton"
import { Modal } from "src/components/organisms/Modal"
import { MIN_TIP_POST_PRICE } from "src/config/post"
import { LandingMessageEnum } from "src/helpers/landing-messages"
import { usePay } from "src/hooks/usePay"

interface TipPostModalProps {
  post: PostDto
  setPost: Dispatch<SetStateAction<PostDto | null>>
}

const TipPostModal: FC<TipPostModalProps> = ({ post, setPost }) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<{
    "tip-value": number
  }>()
  const tipValue = watch("tip-value")
  const api = new PostApi()
  const registerTip = async () => {
    return await api.registerTipPost({
      tipPostRequestDto: {
        postId: post.postId,
        amount: Number(getValues("tip-value")),
        payinMethod: payinMethod
      }
    })
  }

  const registerData = async () => {
    return {
      blocked: undefined,
      amount: Number(getValues("tip-value"))
    } as PayinDataDto
  }

  const { loading, submit } = usePay(
    registerTip,
    registerData,
    undefined,
    LandingMessageEnum.TIP
  )

  const onSubmit = () => {
    handleSubmit(submit)
    setPost(null)
  }

  return (
    <Modal isOpen setOpen={() => setPost(null)}>
      <div className="mb-4 flex h-[115px] w-full flex-row items-end justify-between rounded bg-gradient-to-r from-[#66697B] to-[#9C9DA9] p-4">
        <span className="max-w-[50%] self-center text-[28px] font-bold leading-8 text-white">
          Tip Post (Minimum ${MIN_TIP_POST_PRICE})
        </span>
      </div>
      <NumberInput
        className="border-passes-dark-100 bg-transparent"
        errors={errors}
        name="tip-value"
        options={{
          required: { message: "Tip amount is required", value: true },
          min: {
            value: MIN_TIP_POST_PRICE,
            message: `Tip must be more than $${MIN_TIP_POST_PRICE}`
          }
        }}
        register={register}
        type="currency"
      />
      <PaymentModalBody
        closeModal={() => setPost(null)}
        price={tipValue}
        setPayinMethod={setPayinMethod}
      />
      <TipPostButton isLoading={loading} onClick={onSubmit} />
    </Modal>
  )
}

export default TipPostModal // eslint-disable-line import/no-default-export
