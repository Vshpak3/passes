import { GetPayinMethodResponseDtoMethodEnum } from "@passes/api-client"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import React from "react"

export const cryptoWalletsType = (value: string, chain?: string) => {
  switch (value) {
    case GetPayinMethodResponseDtoMethodEnum.PhantomCircleUsdc:
      return (
        <>
          <PhantomIcon />
          <span className="ml-[20px]">Phantom</span>
        </>
      )
    case GetPayinMethodResponseDtoMethodEnum.MetamaskCircleUsdc:
      return (
        <>
          <MetamaskIcon />
          <span className="ml-[20px]">
            Metamask {chain?.toUpperCase()} USDC
          </span>
        </>
      )
    case GetPayinMethodResponseDtoMethodEnum.MetamaskCircleEth:
      return (
        <>
          <MetamaskIcon />
          <span className="ml-[20px]">Metamask ETH USDC</span>
        </>
      )
  }
}
