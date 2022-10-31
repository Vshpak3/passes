import { PayinMethodDtoChainEnum } from "@passes/api-client"

export const buttonName = (_isEmbedded?: boolean) => {
  return _isEmbedded ? "Use" : "Set Default"
}

export const payinMethodDisplayNames = {
  [PayinMethodDtoChainEnum.Avax]: "USDC (AVAX)",
  [PayinMethodDtoChainEnum.Eth]: "USDC (ETH)",
  [PayinMethodDtoChainEnum.Matic]: "USDC (MATIC)",
  [PayinMethodDtoChainEnum.Sol]: "USDC (SOL)"
}
