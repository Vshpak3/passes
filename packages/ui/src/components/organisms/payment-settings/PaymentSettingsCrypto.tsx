import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { FC, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "src/components/atoms/Button"
import { Select } from "src/components/atoms/input/Select"
import {
  deserializePayinMethod,
  MetaMaskSelectOptions,
  PhantomSelectOptions,
  serializePayinMethod
} from "src/helpers/payment/payin-serialize"
import { usePayinMethod } from "src/hooks/usePayinMethod"

export const buttonName = (_isEmbedded?: boolean) => {
  return _isEmbedded ? "Use" : "Set Default"
}

interface PaymentSettingsCryptoProps {
  isEmbedded: boolean
  handleSetDefaultPayinMethod: (value: PayinMethodDto) => Promise<void>
}

export const PaymentSettingsCrypto: FC<PaymentSettingsCryptoProps> = ({
  isEmbedded,
  handleSetDefaultPayinMethod
}) => {
  const { defaultPayinMethod } = usePayinMethod(true)

  const { register, getValues, setValue, watch } = useForm({
    defaultValues: {
      metamask: MetaMaskSelectOptions[0].value as string,
      phantom: PhantomSelectOptions[0].value as string
    }
  })

  useEffect(() => {
    switch (defaultPayinMethod?.method) {
      case PayinMethodDtoMethodEnum.MetamaskCircleEth:
      case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
        setValue("metamask", serializePayinMethod(defaultPayinMethod))
    }
  }, [defaultPayinMethod, setValue])

  return (
    <div className="flex flex-col">
      <span className="mb-3 text-[18px] font-bold text-white">
        Use Crypto as a Payment Method
      </span>
      <div className="flex items-center justify-start">
        <div className="flex flex-1 flex-row items-center justify-start">
          <MetamaskIcon width="40px" />
          <span className="mx-2 basis-1/4 text-[16px] font-bold text-white md:mx-4">
            Metamask
          </span>
          <Select
            className="my-4 w-[130px]"
            defaultValue={MetaMaskSelectOptions[0]}
            name="metamask"
            onChange={(newValue: string) => setValue("metamask", newValue)}
            register={register}
            selectOptions={MetaMaskSelectOptions}
          />
        </div>
        {watch("metamask") === serializePayinMethod(defaultPayinMethod) ? (
          <Button tag="button" variant="gray">
            <span className="text-[14px] font-[700]">
              {isEmbedded ? "Selected" : "Default"}
            </span>
          </Button>
        ) : (
          <Button
            className="w-auto px-1 py-2 md:px-4"
            onClick={async () =>
              await handleSetDefaultPayinMethod(
                deserializePayinMethod(getValues("metamask"))
              )
            }
            tag="button"
            variant="purple-light"
          >
            <span className="font-[700]">{buttonName(isEmbedded)}</span>
          </Button>
        )}
      </div>
      <div className="flex items-center justify-start">
        <div className="flex flex-1 flex-row items-center">
          <PhantomIcon width="40px" />
          <span className="mx-2 basis-1/4 text-[16px] font-bold text-white md:mx-4">
            Phantom
          </span>
          <Select
            className="my-4 w-[130px]"
            defaultValue={PhantomSelectOptions[0]}
            name="phantom"
            onChange={(newValue: "sol") => setValue("phantom", newValue)}
            register={register}
            selectOptions={PhantomSelectOptions}
          />
        </div>
        {watch("phantom") === serializePayinMethod(defaultPayinMethod) ? (
          <Button tag="button" variant="gray">
            <span className="text-[14px] font-[700]">
              {isEmbedded ? "Selected" : "Default"}
            </span>
          </Button>
        ) : (
          <Button
            className="w-auto px-1 py-2 md:px-4"
            onClick={async () =>
              await handleSetDefaultPayinMethod(
                deserializePayinMethod(getValues("phantom"))
              )
            }
            tag="button"
            variant="purple-light"
          >
            <span className="font-[700]">{buttonName(isEmbedded)}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
