import {
  GetDefaultWalletRequestDtoChainEnum,
  WalletApi,
  WalletDto
} from "@passes/api-client"
import { useEffect } from "react"
import { errorMessage } from "src/helpers/error"
import { accessTokenKey } from "src/helpers/token"
import useSWR from "swr"

import { useLocalStorage } from "./useLocalStorage"

export const useUserDefaultMintingWallets = () => {
  const [accessToken] = useLocalStorage(accessTokenKey, "")
  const api = new WalletApi()

  const {
    data: ethWallet,
    isValidating: loadingEthWallet,
    mutate: mutateEthWallet
  } = useSWR<WalletDto>(accessToken ? "/mint/wallet/eth" : null, async () => {
    return await api.getDefaultWallet({
      getDefaultWalletRequestDto: { chain: "eth" }
    })
  })

  const {
    data: solWallet,
    isValidating: loadingSolWallet,
    mutate: mutateSolWallet
  } = useSWR<WalletDto>(accessToken ? "/mint/wallet/sol" : null, async () => {
    return await api.getDefaultWallet({
      getDefaultWalletRequestDto: { chain: "sol" }
    })
  })

  async function getDefaultWallet() {
    mutateEthWallet()
    mutateSolWallet()
  }
  async function setDefaultWallet(
    walletId: string,
    chain: GetDefaultWalletRequestDtoChainEnum
  ) {
    try {
      console.log(walletId)
      await api.setDefaultWallet({
        setDefaultWalletRequestDto: { walletId, chain }
      })
      setTimeout(() => undefined, 500)
      getDefaultWallet()
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  useEffect(() => {
    if (!ethWallet) {
      mutateEthWallet()
    }
    if (!solWallet) {
      mutateSolWallet()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    loadingEthWallet,
    loadingSolWallet,
    ethWallet,
    solWallet,
    getDefaultWallet,
    setDefaultWallet
  }
}
