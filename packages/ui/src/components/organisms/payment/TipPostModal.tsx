import { yupResolver } from "@hookform/resolvers/yup"
import {
  PayinDataDto,
  PayinMethodDto,
  PayinMethodDtoMethodEnum,
  PostApi,
  PostDto
} from "@passes/api-client"
import {
  MAX_POST_TIP_PRICE,
  MIN_POST_TIP_PRICE
} from "@passes/shared-constants"
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react"
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import { NumberInput } from "src/components/atoms/input/NumberInput"
import { NewCard } from "src/components/molecules/payment/NewCard"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { PaymentModalFooter } from "src/components/molecules/payment/PaymentModalFooter"
import { PaymentModalHeader } from "src/components/molecules/payment/PaymentModalHeader"
import { TipPostButton } from "src/components/molecules/payment/TipPostButton"
import { Dialog } from "src/components/organisms/Dialog"
import { LandingMessageEnum } from "src/helpers/landing-messages"
import { usePay } from "src/hooks/usePay"

const TIP_VALUE = "tip-value"

interface TipPostFormProps {
  [TIP_VALUE]: number
}

const tipPostForm = object({
  [TIP_VALUE]: string()
    .required("Please enter a tip value")
    .test(
      "min",
      `The minimum tip amount is $${MIN_POST_TIP_PRICE}`,
      (value) => parseFloat(value || "") >= MIN_POST_TIP_PRICE
    )
    .test(
      "max",
      `The maximum tip amount is $${MAX_POST_TIP_PRICE}`,
      (value) => parseFloat(value || "") <= MAX_POST_TIP_PRICE
    )
})

interface TipPostModalProps {
  post: PostDto
  setPost: Dispatch<SetStateAction<PostDto | null>>
}

const api = new PostApi()

const TipPostModal: FC<TipPostModalProps> = ({ post, setPost }) => {
  const [payinMethod, setPayinMethod] = useState<PayinMethodDto>()
  const [newCard, setNewCard] = useState<boolean>(false)

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch
  } = useForm<TipPostFormProps>({
    resolver: yupResolver(tipPostForm)
  })
  const tipValue = watch(TIP_VALUE)
  const registerTip = useCallback(async () => {
    return await api.registerTipPost({
      tipPostRequestDto: {
        postId: post.postId,
        amount: Number(getValues(TIP_VALUE)),
        payinMethod: payinMethod
      }
    })
  }, [getValues, payinMethod, post.postId])

  const registerData = useCallback(async () => {
    return {
      blocked: undefined,
      amount: Number(getValues(TIP_VALUE))
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
  }
  const { displayName, userId, username } = post

  useEffect(() => {
    if (isSubmitSuccessful) {
      setPost(null)
    }
  }, [isSubmitSuccessful, setPost])

  return (
    <Dialog
      className="flex w-[600px] max-w-full flex-col items-center justify-center rounded-[5px] border border-white/10 bg-passes-black px-6 py-5 transition-all"
      onClose={() => setPost(null)}
      open
    >
      {newCard ? (
        <NewCard callback={() => setNewCard(false)} isEmbedded />
      ) : (
        <>
          <PaymentModalHeader
            title="Send Tip"
            user={{ userId, username, displayName }}
          />
          <div className="flex items-center rounded border border-passes-primary-color pl-4">
            <div className="basis-3/4">
              <span>Enter Tip Amount</span>
            </div>
            <NumberInput
              className="border-0 font-bold focus:border-0 focus:ring-0"
              name={TIP_VALUE}
              register={register}
              type="currency"
            />
          </div>
          {errors?.[TIP_VALUE] && (
            <span className="text-right text-xs text-red-500">
              {errors?.[TIP_VALUE].message}
            </span>
          )}
          <div className="my-4" />
          <PaymentModalBody
            closeModal={() => setPost(null)}
            price={tipValue}
            setNewCard={setNewCard}
            setPayinMethod={setPayinMethod}
          />
          <PaymentModalFooter onClose={() => setPost(null)}>
            <TipPostButton
              isDisabled={
                !payinMethod ||
                payinMethod.method === PayinMethodDtoMethodEnum.None
              }
              isLoading={loading}
              onClick={onSubmit}
            />
          </PaymentModalFooter>
        </>
      )}
    </Dialog>
  )
}

export default TipPostModal // eslint-disable-line import/no-default-export
