import {
  GetDefaultWalletRequestDtoChainEnum,
  WalletApi,
  WalletDto
} from "@passes/api-client"
import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"
import { useUser } from "./useUser"

const CACHE_KEY_DEFAULT_WALLET: Record<
  GetDefaultWalletRequestDtoChainEnum,
  string | undefined
> = {
  eth: "/wallet/default/eth",
  sol: "/wallet/default/sol",
  avax: undefined,
  matic: undefined
}

export const useUserDefaultMintingWallets = () => {
  const { accessToken } = useUser()

  const api = new WalletApi()

  const defaultWalletGetter = (chain: GetDefaultWalletRequestDtoChainEnum) => {
    return async () =>
      await api.getDefaultWallet({ getDefaultWalletRequestDto: { chain } })
  }

  const {
    data: ethWallet,
    isValidating: loadingEthWallet,
    mutate: mutateEthWallet
  } = useSWR<WalletDto>(
    accessToken ? CACHE_KEY_DEFAULT_WALLET["eth"] : null,
    defaultWalletGetter("eth")
  )

  const {
    data: solWallet,
    isValidating: loadingSolWallet,
    mutate: mutateSolWallet
  } = useSWR<WalletDto>(
    accessToken ? CACHE_KEY_DEFAULT_WALLET["sol"] : null,
    defaultWalletGetter("sol")
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (
    update: WalletDto,
    chain: GetDefaultWalletRequestDtoChainEnum
  ) => {
    _mutateManual(CACHE_KEY_DEFAULT_WALLET[chain], update, {
      populateCache: (update: WalletDto) => {
        return update
      },
      revalidate: false
    })
  }

  async function setDefaultWallet(
    walletId: string,
    chain: GetDefaultWalletRequestDtoChainEnum
  ) {
    try {
      const wallet = await api.setDefaultWallet({
        setDefaultWalletRequestDto: { walletId, chain }
      })
      mutateManual(wallet, chain)
    } catch (error: unknown) {
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
    ethWallet,
    solWallet,
    loadingEthWallet,
    loadingSolWallet,
    setDefaultWallet
  }
}
