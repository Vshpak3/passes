import { yupResolver } from "@hookform/resolvers/yup"
import {
  PayinDataDto,
  PayinMethodDto,
  PostApi,
  PostDto
} from "@passes/api-client"
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

import { Button } from "src/components/atoms/button/Button"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { SectionTitle } from "src/components/atoms/SectionTitle"
import { PaymentModalBody } from "src/components/molecules/payment/PaymentModalBody"
import { TipPostButton } from "src/components/molecules/payment/TipPostButton"
import { Modal } from "src/components/organisms/Modal"
import { ProfileImage } from "src/components/organisms/profile/profile-details/ProfileImage"
import { MAX_TIP_POST_PRICE, MIN_TIP_POST_PRICE } from "src/config/post"
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
      `The minimum tip amount is $${MIN_TIP_POST_PRICE}`,
      (value) => parseFloat(value || "") >= MIN_TIP_POST_PRICE
    )
    .test(
      "max",
      `The maximum tip amount is $${MAX_TIP_POST_PRICE}`,
      (value) => parseFloat(value || "") <= MAX_TIP_POST_PRICE
    )
})

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
    <Modal
      closable={false}
      isOpen
      modalContainerClassname="max-w-[80%] lg:max-w-[30%]"
      setOpen={() => setPost(null)}
    >
      <SectionTitle>Send Tip</SectionTitle>
      <div className="mb-4 flex items-center border-b border-passes-gray-600 pt-2 pb-6">
        <ProfileImage type="thumbnail" userId={userId} />
        <div className="ml-4 flex flex-col">
          <span>{displayName}</span>
          <span className="text-passes-dark-gray">@{username}</span>
        </div>
      </div>
      <div className="flex items-center rounded border border-passes-primary-color pl-4">
        <div className="basis-3/4">
          <span>Enter Tip Amount</span>
          <span className="ml-4 text-xs text-passes-dark-gray">Minimum $3</span>
        </div>
        <NumberInput
          className="border-0 font-bold"
          maxInput={MAX_TIP_POST_PRICE}
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
        setPayinMethod={setPayinMethod}
      />
      <div className="flex w-full items-center justify-end">
        <Button
          className="mr-8 font-bold text-passes-primary-color"
          onClick={() => setPost(null)}
        >
          Cancel
        </Button>
        <TipPostButton isLoading={loading} onClick={onSubmit} />
      </div>
    </Modal>
  )
}

export default TipPostModal // eslint-disable-line import/no-default-export
