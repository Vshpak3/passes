import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { memo, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Select } from "src/components/atoms/Select"
import {
  deserializePayinMethod,
  MetaMaskSelectOptions,
  PhantomSelectOptions,
  serializePayinMethod
} from "src/helpers/payment/payin-serialize"
import { displayCardIcon } from "src/helpers/payment/paymentMethod"
import { usePayinMethod } from "src/hooks/usePayinMethod"
// import { PayinMethodDisplay } from "./PayinMethodDisplay"
import { ThreeDSInfo } from "./ThreeDSInfo"

interface PaymentModalBodyProps {
  price: number
  closeModal: () => void
  setPayinMethod: (method: PayinMethodDto) => void
}
interface PaymentModalBodyFromProps {
  method: string
}

const MetamMaskSelectOptionsWithImage = MetaMaskSelectOptions.map((option) => {
  const newOption = { ...option }
  newOption.label = (
    <>
      <MetamaskIcon width="20px" /> {option.label}
    </>
  )
  return newOption
})

const PhantomSelectOptionsWithImage = PhantomSelectOptions.map((option) => {
  const newOption = { ...option }
  newOption.label = (
    <>
      <PhantomIcon width="20px" /> {option.label}
    </>
  )
  return newOption
})

const PaymentModalBodyUnmemo = ({
  price,
  setPayinMethod
}: // closeModal
PaymentModalBodyProps) => {
  const { defaultPayinMethod, cards } = usePayinMethod()

  const { register, setValue, watch } = useForm<PaymentModalBodyFromProps>({
    defaultValues: {
      method: serializePayinMethod({ method: PayinMethodDtoMethodEnum.None })
    }
  })
  const methodSeralized = watch("method")
  const payinMethod = deserializePayinMethod(methodSeralized)
  const cardOptions =
    cards?.map((card) => {
      return {
        label: (
          <>
            {displayCardIcon(card.firstDigit, 35)}
            **** **** **** {card.fourDigits}
          </>
        ),
        value: serializePayinMethod({
          method: PayinMethodDtoMethodEnum.CircleCard,
          cardId: card.id
        })
      }
    }) ?? []
  useEffect(() => {
    setValue("method", serializePayinMethod(defaultPayinMethod))
  }, [defaultPayinMethod, setValue])
  useEffect(() => {
    setPayinMethod(payinMethod)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodSeralized])
  const options = [
    ...cardOptions,
    ...MetamMaskSelectOptionsWithImage,
    ...PhantomSelectOptionsWithImage
  ]
  // const label
  const defaultSelected = defaultPayinMethod
    ? options.filter(
        (option) => option.value === serializePayinMethod(payinMethod)
      )[0] ?? "None"
    : undefined
  return (
    <form>
      {/* <PayinMethodDisplay
        payinMethod={payinMethod}
        card={card}
        closeModal={closeModal}
      /> */}
      Payment Method:
      <Select
        register={register}
        selectOptions={options}
        onChange={(newValue: string) => setValue("method", newValue)}
        name="method"
        className="my-4 w-[130px]"
        defaultValue={defaultSelected}
        changeOnDefault={true}
      />
      <ThreeDSInfo price={price} payinMethod={payinMethod} />
    </form>
  )
}

export const PaymentModalBody = memo(PaymentModalBodyUnmemo)
