import { CircleCardDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import { useForm } from "react-hook-form"

import { Select } from "src/components/atoms/Select"
import {
  deserializePayinMethod,
  MetaMaskSelectOptions,
  PhantomSelectOptions,
  serializePayinMethod
} from "src/helpers/payment/serialize"
import { usePayinMethod } from "src/hooks/usePayinMethod"
import { PayinMethodDisplay } from "./PayinMethodDisplay"
import { ThreeDSInfo } from "./ThreeDSInfo"

interface PaymentModalBodyProps {
  price: number
  card?: CircleCardDto
  closeModal: () => void
}
interface PaymentModalBodyFromProps {
  method: string
}

export const PaymentModalBody = ({
  price,
  card,
  closeModal
}: PaymentModalBodyProps) => {
  const { defaultPayinMethod } = usePayinMethod()
  const { register, setValue, watch } = useForm<PaymentModalBodyFromProps>({
    defaultValues: {
      method: serializePayinMethod(
        defaultPayinMethod ?? { method: PayinMethodDtoMethodEnum.None }
      )
    }
  })
  const methodSeralized = watch("method")
  const payinMethod = deserializePayinMethod(methodSeralized)

  return (
    <>
      <PayinMethodDisplay
        payinMethod={payinMethod}
        card={card}
        closeModal={closeModal}
      />
      <ThreeDSInfo price={price} payinMethod={payinMethod} />
      <Select
        register={register}
        selectOptions={[...MetaMaskSelectOptions, ...PhantomSelectOptions]}
        onChange={(newValue: string) => setValue("method", newValue)}
        name="method"
        className="my-4 w-[130px]"
      />
    </>
  )
}
