import {
  GetDefaultWalletRequestDtoChainEnum,
  WalletApi,
  WalletDto
} from "@passes/api-client"
import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"
import { useUser } from "./useUser"

const CACHE_KEY_DEFAULT_WALLET_ETH = "/mint/wallet/eth"
const CACHE_KEY_DEFAULT_WALLET_SOL = "/mint/wallet/eth"

export const useUserDefaultMintingWallets = () => {
  const { accessToken } = useUser()

  const api = new WalletApi()

  const {
    data: ethWallet,
    isValidating: loadingEthWallet,
    mutate: mutateEthWallet
  } = useSWR<WalletDto>(
    accessToken ? CACHE_KEY_DEFAULT_WALLET_ETH : null,
    async () => {
      return await api.getDefaultWallet({
        getDefaultWalletRequestDto: {
          chain: GetDefaultWalletRequestDtoChainEnum.Eth
        }
      })
    }
  )

  const {
    data: solWallet,
    isValidating: loadingSolWallet,
    mutate: mutateSolWallet
  } = useSWR<WalletDto>(
    accessToken ? CACHE_KEY_DEFAULT_WALLET_SOL : null,
    async () => {
      return await api.getDefaultWallet({
        getDefaultWalletRequestDto: {
          chain: GetDefaultWalletRequestDtoChainEnum.Sol
        }
      })
    }
  )

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManualEth = (update: WalletDto) =>
    _mutateManual(CACHE_KEY_DEFAULT_WALLET_ETH, update, {
      populateCache: (update: WalletDto) => {
        return update
      },
      revalidate: false
    })
  const mutateManualSol = (update: WalletDto) =>
    _mutateManual(CACHE_KEY_DEFAULT_WALLET_SOL, update, {
      populateCache: (update: WalletDto) => {
        return update
      },
      revalidate: false
    })

  async function setDefaultWallet(
    walletId: string,
    chain: GetDefaultWalletRequestDtoChainEnum
  ) {
    try {
      const wallet = await api.setDefaultWallet({
        setDefaultWalletRequestDto: { walletId, chain }
      })
      if (chain === GetDefaultWalletRequestDtoChainEnum.Eth) {
        mutateManualEth(wallet)
      } else if (chain === GetDefaultWalletRequestDtoChainEnum.Sol) {
        mutateManualSol(wallet)
      }
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
