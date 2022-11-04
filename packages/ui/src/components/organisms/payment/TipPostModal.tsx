import {
  PayinDataDto,
  PayinMethodDto,
  PostApi,
  PostDto
} from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"
import { useForm } from "react-hook-form"

import { NumberInput } from "src/components/atoms/input/NumberInput"
import { SectionTitle } from "src/components/atoms/SectionTitle"
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

const api = new PostApi()
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
  const registerTip = useCallback(async () => {
    return await api.registerTipPost({
      tipPostRequestDto: {
        postId: post.postId,
        amount: Number(getValues("tip-value")),
        payinMethod: payinMethod
      }
    })
  }, [getValues, payinMethod, post.postId])

  const registerData = useCallback(async () => {
    return {
      blocked: undefined,
      amount: Number(getValues("tip-value"))
    } as PayinDataDto
  }, [getValues])

  const { loading, submit } = usePay(
    registerTip,
    registerData,
    undefined,
    LandingMessageEnum.TIP
  )

  const onSubmit = async () => {
    await handleSubmit(submit)()
    setPost(null)
  }
  return (
    <Modal isOpen setOpen={() => setPost(null)}>
      <SectionTitle>Send Tip</SectionTitle>
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
      <span className="text-passes-dark-gray">
        This message will be sent with your tip after purchase.
      </span>
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
