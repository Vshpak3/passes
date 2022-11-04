import {
  AuthWalletResponseDtoChainEnum,
  CreateUnauthenticatedWalletRequestDto,
  CreateWalletRequestDto,
  WalletApi,
  WalletDto
} from "@passes/api-client"
import { useEffect } from "react"
import useSWR, { useSWRConfig } from "swr"

import { errorMessage } from "src/helpers/error"
import { useUser } from "./useUser"

const CACHE_KEY_WALLETS = "/wallets"

export const useUserConnectedWallets = () => {
  const { user, accessToken } = useUser()

  const api = new WalletApi()

  const {
    data: wallets,
    isValidating: loading,
    mutate
  } = useSWR(accessToken ? CACHE_KEY_WALLETS : null, async () => {
    return (await api.getWallets()).wallets
  })

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManual = (update: WalletDto[]) =>
    _mutateManual(CACHE_KEY_WALLETS, update, {
      populateCache: (update: WalletDto[]) => {
        return update
      },
      revalidate: false
    })

  const addWallet = async (request: CreateWalletRequestDto) => {
    const { id } = await api.createWallet({ createWalletRequestDto: request })
    const _wallets = wallets || []
    _wallets?.push({
      walletId: id,
      userId: user?.userId ?? null,
      address: request.walletAddress,
      chain: request.chain,
      custodial: false,
      authenticated: true
    })
    mutateManual(_wallets)
  }

  const addUnauthenticatedWallet = async (
    request: CreateUnauthenticatedWalletRequestDto
  ) => {
    const { id } = await api.createUnauthenticatedWallet({
      createUnauthenticatedWalletRequestDto: request
    })
    const _wallets = wallets || []
    _wallets?.push({
      walletId: id,
      userId: user?.userId ?? null,
      address: request.walletAddress,
      chain: request.chain,
      custodial: false,
      authenticated: false
    })
    mutateManual(_wallets)
  }

  const deleteWallet = async (walletId: string) => {
    await api.removeWallet({ walletId })
    if (wallets) {
      mutateManual(wallets.filter((w) => w.walletId !== walletId))
    }
  }

  const getMessageToSign = async (
    walletAddress: string,
    chain: AuthWalletResponseDtoChainEnum
  ) => {
    try {
      const res = await api.authMessage({
        authWalletRequestDto: { walletAddress, chain }
      })
      return res.rawMessage
    } catch (error) {
      errorMessage(error, true)
    }
  }

  useEffect(() => {
    if (!wallets) {
      mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    wallets,
    loading,
    mutate,
    addWallet,
    addUnauthenticatedWallet,
    deleteWallet,
    getMessageToSign
  }
}
