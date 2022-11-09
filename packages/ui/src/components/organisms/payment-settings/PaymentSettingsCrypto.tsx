import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { PayinMethodDto, PayinMethodDtoMethodEnum } from "@passes/api-client"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { FC, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "src/components/atoms/button/Button"
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
        break
      case PayinMethodDtoMethodEnum.PhantomCircleUsdc:
        setValue("phantom", serializePayinMethod(defaultPayinMethod))
        break
    }
  }, [defaultPayinMethod, setValue])

  return (
    <div className="flex flex-col">
      <h3 className="mb-3 text-[18px] font-bold text-white">
        Add Crypto Wallet as a Payment Method
      </h3>
      <div className="flex w-full flex-wrap md:flex-nowrap">
        <div className="mt-2 flex min-w-[140px] basis-full items-center md:mt-0 md:basis-1/4">
          <MetamaskIcon className="shrink-0" width="40px" />
          <span className="mx-2 basis-1/4 text-[16px] font-bold text-white md:mx-4">
            Metamask
          </span>
        </div>
        <div className="mt-2 basis-full md:ml-4 md:mt-0 md:basis-1/4">
          <Select
            className="my-4 bg-[#18090E] md:w-[145px]"
            defaultValue={MetaMaskSelectOptions[0]}
            name="metamask"
            onChange={(newValue: string) => setValue("metamask", newValue)}
            register={register}
            selectOptions={MetaMaskSelectOptions}
          />
        </div>
        <div className="ml-auto mt-2 flex basis-full items-center md:mt-0 md:basis-auto">
          {watch("metamask") === serializePayinMethod(defaultPayinMethod) ? (
            <Button variant="pink" disabled>
              <span className="text-[14px] font-[700]">
                {isEmbedded ? "Selected" : "Default"}
              </span>
            </Button>
          ) : (
            <Button
              onClick={async () =>
                await handleSetDefaultPayinMethod(
                  deserializePayinMethod(getValues("metamask"))
                )
              }
              variant="pink"
            >
              <span className="font-[700]">{buttonName(isEmbedded)}</span>
            </Button>
          )}
        </div>
      </div>
      <div className="mt-6 flex w-full flex-wrap md:mt-0 md:flex-nowrap">
        <div className="mt-2 flex min-w-[140px] basis-full items-center md:mt-0 md:basis-1/4">
          <div className="flex flex-row items-center">
            <PhantomIcon className="shrink-0" width="40px" />
            <span className="mx-2 basis-1/4 text-[16px] font-bold text-white md:mx-4">
              Phantom
            </span>
          </div>
        </div>
        <div className="mt-2 basis-full md:ml-4 md:mt-0 md:basis-1/4">
          <Select
            className="my-4 bg-[#18090E] md:w-[145px]"
            defaultValue={PhantomSelectOptions[0]}
            name="phantom"
            onChange={(newValue: "sol") => setValue("phantom", newValue)}
            register={register}
            selectOptions={PhantomSelectOptions}
          />
        </div>
        <div className="mt-2 ml-auto flex basis-full items-center md:mt-0 md:basis-auto">
          {watch("phantom") === serializePayinMethod(defaultPayinMethod) ? (
            <Button variant="pink" disabled>
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
              variant="pink"
            >
              <span className="font-[700]">{buttonName(isEmbedded)}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
