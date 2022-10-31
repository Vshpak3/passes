import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import {
  PayinMethodDtoChainEnum,
  PayinMethodDtoMethodEnum
} from "@passes/api-client"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import { FC, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "src/components/atoms/Button"
import { Select } from "src/components/atoms/Select"
import { buttonName, payinMethodDisplayNames } from "./Helper"

interface PaymentSettingsCryptoProps {
  isEmbedded: boolean
  defaultPayinMethod: any
  handleSetDefaultPayInMethod: any
}

export const PaymentSettingsCrypto: FC<PaymentSettingsCryptoProps> = ({
  isEmbedded,
  defaultPayinMethod,
  handleSetDefaultPayInMethod
}) => {
  const { register, getValues, setValue, watch } = useForm({
    defaultValues: {
      metamask:
        PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
        "." +
        PayinMethodDtoChainEnum.Eth,
      phantom: PayinMethodDtoChainEnum.Sol
    }
  })

  useEffect(() => {
    switch (defaultPayinMethod?.method) {
      case PayinMethodDtoMethodEnum.MetamaskCircleEth:
      case PayinMethodDtoMethodEnum.MetamaskCircleUsdc:
        setValue(
          "metamask",
          defaultPayinMethod?.method + "." + defaultPayinMethod?.chain
        )
    }
  }, [defaultPayinMethod, setValue])

  return (
    <div className="flex flex-col">
      <span className="mb-3 text-[18px] font-bold text-white">
        Use Crypto as a Payment method
      </span>
      <div className="flex items-center justify-start">
        <div className="flex flex-1 flex-row items-center">
          <MetamaskIcon width="40px" />
          <span className="mx-2 basis-1/4 text-[16px] font-bold text-white md:mx-4">
            Metamask
          </span>
          <Select
            register={register}
            selectOptions={
              isEmbedded
                ? [
                    {
                      label:
                        payinMethodDisplayNames[PayinMethodDtoChainEnum.Eth],
                      value:
                        PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
                        "." +
                        PayinMethodDtoChainEnum.Eth
                    },
                    {
                      label: "ETH (ETH)",
                      value:
                        PayinMethodDtoMethodEnum.MetamaskCircleEth +
                        "." +
                        PayinMethodDtoChainEnum.Eth
                    }
                  ]
                : [
                    {
                      label:
                        payinMethodDisplayNames[PayinMethodDtoChainEnum.Eth],
                      value:
                        PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
                        "." +
                        PayinMethodDtoChainEnum.Eth
                    },
                    {
                      label:
                        payinMethodDisplayNames[PayinMethodDtoChainEnum.Avax],
                      value:
                        PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
                        "." +
                        PayinMethodDtoChainEnum.Avax
                    },
                    {
                      label:
                        payinMethodDisplayNames[PayinMethodDtoChainEnum.Matic],
                      value:
                        PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
                        "." +
                        PayinMethodDtoChainEnum.Matic
                    }
                  ]
            }
            onChange={(newValue: string) => setValue("metamask", newValue)}
            name="metamask"
            className="my-4 w-[130px]"
            defaultValue={{
              label: payinMethodDisplayNames[PayinMethodDtoChainEnum.Eth],
              value:
                PayinMethodDtoMethodEnum.MetamaskCircleUsdc +
                "." +
                PayinMethodDtoChainEnum.Eth
            }}
          />
        </div>
        {watch("metamask") ===
        defaultPayinMethod?.method + "." + defaultPayinMethod?.chain ? (
          <Button tag="button" variant="gray">
            <span className="text-[14px] font-[700]">
              {isEmbedded ? "Selected" : "Default"}
            </span>
          </Button>
        ) : (
          <Button
            onClick={async () =>
              handleSetDefaultPayInMethod({
                method: getValues("metamask").split(
                  "."
                )[0] as PayinMethodDtoMethodEnum,
                chain: getValues("metamask").split(
                  "."
                )[1] as PayinMethodDtoChainEnum
              })
            }
            tag="button"
            variant="purple-light"
            className="w-auto px-1 py-2 md:px-4"
          >
            <span className="font-[700]">{buttonName(isEmbedded)}</span>
          </Button>
        )}
      </div>
      {!isEmbedded && (
        <div className="flex items-center justify-start">
          <div className="flex flex-1 flex-row items-center">
            <PhantomIcon width="40px" />
            <span className="mx-2 basis-1/4 text-[16px] font-bold text-white md:mx-4">
              Phantom
            </span>
            <Select
              register={register}
              defaultValue={{
                label: payinMethodDisplayNames[PayinMethodDtoChainEnum.Sol],
                value: PayinMethodDtoChainEnum.Sol
              }}
              selectOptions={[
                {
                  label: payinMethodDisplayNames[PayinMethodDtoChainEnum.Sol],
                  value: PayinMethodDtoChainEnum.Sol
                }
              ]}
              onChange={(newValue: "sol") => setValue("phantom", newValue)}
              name="phantom"
              className="my-4 w-[130px]"
            />
          </div>
          {PayinMethodDtoMethodEnum.PhantomCircleUsdc ===
          defaultPayinMethod?.method ? (
            <Button tag="button" variant="gray">
              <span className="text-[14px] font-[700]">
                {isEmbedded ? "Selected" : "Default"}
              </span>
            </Button>
          ) : (
            <Button
              onClick={async () =>
                handleSetDefaultPayInMethod({
                  method: PayinMethodDtoMethodEnum.PhantomCircleUsdc,
                  chain: getValues("phantom") as PayinMethodDtoChainEnum
                })
              }
              tag="button"
              variant="purple-light"
              className="w-auto px-1 py-2 md:px-4"
            >
              <span className="font-[700]">{buttonName(isEmbedded)}</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
