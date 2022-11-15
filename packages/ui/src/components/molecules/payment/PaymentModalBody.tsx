import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import ms from "ms"
import Link from "next/link"
import CardIcon from "public/icons/bank-card.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react"
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
import { ThreeDSInfo } from "./ThreeDSInfo"

interface PaymentModalBodyProps {
  price: number
  closeModal: () => void
  setPayinMethod: (method: PayinMethodDto) => void
  setNewCard: Dispatch<SetStateAction<boolean>>
}
interface PaymentModalBodyFromProps {
  method: string
}

const MetamMaskSelectOptionsWithImage = MetaMaskSelectOptions.map((option) => {
  const newOption = { ...option }
  newOption.label = (
    <span className="my-1 flex pl-[2px]">
      <MetamaskIcon width="20px" /> <span className="ml-4">{option.label}</span>
    </span>
  )
  return newOption
})

const PhantomSelectOptionsWithImage = PhantomSelectOptions.map((option) => {
  const newOption = { ...option }
  newOption.label = (
    <span className="my-1 flex pl-[2px]">
      <PhantomIcon width="20px" /> <span className="ml-4">{option.label}</span>
    </span>
  )
  return newOption
})

const NewCardValue = "new-card"

const NewCardLabel = (
  <span className="my-1 flex flex-row items-center pl-[2px]">
    <CardIcon className="pt-[2px]" height="20px" width="22px" />
    <span className="ml-4">New Card</span>
  </span>
)
const NewCardOption = { value: NewCardValue, label: NewCardLabel }
export const PaymentModalBody: FC<PaymentModalBodyProps> = ({
  price,
  setPayinMethod,
  closeModal,
  setNewCard
}) => {
  const { defaultPayinMethod, cards } = usePayinMethod(false, ms("1 second"))

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
    NewCardOption,
    ...MetamMaskSelectOptionsWithImage,
    ...PhantomSelectOptionsWithImage
  ]

  const onSelect = (newValue: string) => {
    if (newValue === NewCardValue) {
      setNewCard(true)
    } else {
      setValue("method", newValue)
    }
  }

  const defaultSelected = defaultPayinMethod
    ? options.filter(
        (option) => option.value === serializePayinMethod(payinMethod)
      )[0] ?? "None"
    : undefined

  return (
    <form className="mb-4">
      <div className="mb-2">Payment Method</div>
      <Select
        changeOnDefault
        className="my-4"
        defaultValue={defaultSelected}
        name="method"
        onChange={onSelect}
        selectOptions={options}
      />
      <div className="my-4 mr-1 hidden text-passes-dark-gray">
        Want to update your default payment or add a new one?
        <Link
          className="ml-2 font-light text-passes-primary-color underline"
          href="/settings/payment"
          onClick={closeModal}
        >
          Settings
        </Link>
      </div>
      <div
        className="my-4 mr-1 hidden font-light text-passes-primary-color underline hover:cursor-pointer"
        onClick={() => {
          setNewCard(true)
        }}
      >
        Add a new card
      </div>
      <ThreeDSInfo payinMethod={payinMethod} price={price} />
    </form>
  )
}
