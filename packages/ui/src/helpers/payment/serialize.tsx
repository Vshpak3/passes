import {
  PayinMethodDto,
  PayinMethodDtoChainEnum,
  PayinMethodDtoMethodEnum
} from "@passes/api-client"

export const serializePayinMethod = (payinMethod: PayinMethodDto) => {
  return `${payinMethod.method}_${payinMethod.cardId ?? ""}_${
    payinMethod.chain ?? ""
  }`
}
export const deserializePayinMethod = (
  payinMethodSeralized: string
): PayinMethodDto => {
  const parse = payinMethodSeralized.split("_")
  return {
    method: parse[0] as PayinMethodDtoMethodEnum,
    cardId: parse[1].length ? parse[1] : undefined,
    chain: parse[2].length ? (parse[2] as PayinMethodDtoChainEnum) : undefined
  }
}

export const PayinMethodDisplayNames = {
  [PayinMethodDtoChainEnum.Avax]: "USDC (AVAX)",
  [PayinMethodDtoChainEnum.Eth]: "USDC (ETH)",
  [PayinMethodDtoChainEnum.Matic]: "USDC (MATIC)",
  [PayinMethodDtoChainEnum.Sol]: "USDC (SOL)"
}

export const MetaMaskSelectOptions = [
  {
    label: PayinMethodDisplayNames[PayinMethodDtoChainEnum.Eth],
    value: serializePayinMethod({
      method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc,
      chain: PayinMethodDtoChainEnum.Eth
    })
  },
  {
    label: PayinMethodDisplayNames[PayinMethodDtoChainEnum.Avax],
    value: serializePayinMethod({
      method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc,
      chain: PayinMethodDtoChainEnum.Avax
    })
  },
  {
    label: PayinMethodDisplayNames[PayinMethodDtoChainEnum.Matic],
    value: serializePayinMethod({
      method: PayinMethodDtoMethodEnum.MetamaskCircleUsdc,
      chain: PayinMethodDtoChainEnum.Matic
    })
  }
]

export const PhantomSelectOptions = [
  {
    label: PayinMethodDisplayNames[PayinMethodDtoChainEnum.Sol],
    value: serializePayinMethod({
      method: PayinMethodDtoMethodEnum.PhantomCircleUsdc,
      chain: PayinMethodDtoChainEnum.Sol
    })
  }
]
