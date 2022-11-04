import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import Link from "next/link"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { memo, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Select } from "src/components/atoms/input/Select"
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
  setPayinMethod,
  closeModal
}: PaymentModalBodyProps) => {
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
      Payment Method:
      <Select
        changeOnDefault
        className="my-4 w-[130px]"
        defaultValue={defaultSelected}
        name="method"
        onChange={(newValue: string) => setValue("method", newValue)}
        register={register}
        selectOptions={options}
      />
      <div className="my-4 mr-1 text-passes-dark-gray">
        Want to update your default payment or add a new one?
        <Link
          className="ml-1 text-passes-primary-color underline"
          href="/settings/payment"
          onClick={closeModal}
        >
          Settings
        </Link>
      </div>
      <ThreeDSInfo payinMethod={payinMethod} price={price} />
    </form>
  )
}

export const PaymentModalBody = memo(PaymentModalBodyUnmemo)
