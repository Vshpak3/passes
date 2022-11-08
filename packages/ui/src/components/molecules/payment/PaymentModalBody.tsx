import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import Link from "next/link"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { useEffect, useMemo } from "react"
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
    <span className="my-1 flex">
      <MetamaskIcon width="20px" /> <span className="ml-4">{option.label}</span>
    </span>
  )
  return newOption
})

const PhantomSelectOptionsWithImage = PhantomSelectOptions.map((option) => {
  const newOption = { ...option }
  newOption.label = (
    <span className="my-1 flex">
      <PhantomIcon width="20px" /> <span className="ml-4">{option.label}</span>
    </span>
  )
  return newOption
})

export const PaymentModalBody = ({
  price,
  setPayinMethod,
  closeModal
}: PaymentModalBodyProps) => {
  const { defaultPayinMethod, cards } = usePayinMethod()

  const { setValue, watch } = useForm<PaymentModalBodyFromProps>({
    defaultValues: {
      method: serializePayinMethod({ method: PayinMethodDtoMethodEnum.None })
    }
  })
  const methodSeralized = watch("method")
  const payinMethod = deserializePayinMethod(methodSeralized)
  const cardOptions = useMemo(
    () =>
      cards?.map((card) => {
        return {
          label: (
            <span className="flex">
              {displayCardIcon(card.firstDigit, 25, 35)}
              <span className="ml-1">**** **** **** {card.fourDigits}</span>
            </span>
          ),
          value: serializePayinMethod({
            method: PayinMethodDtoMethodEnum.CircleCard,
            cardId: card.id
          })
        }
      }) ?? [],
    [cards]
  )
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
        className="my-4"
        defaultValue={defaultSelected}
        name="method"
        onChange={(newValue: string) => setValue("method", newValue)}
        selectOptions={options}
      />
      <div className="my-4 mr-1 text-passes-dark-gray">
        Want to update your default payment or add a new one?
        <Link
          className="ml-2 font-light text-passes-primary-color underline"
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
