import {
  GetDefaultWalletRequestDtoChainEnum,
  WalletApi,
  WalletDto
} from "@passes/api-client"
import { useEffect, useState } from "react"
import { errorMessage } from "src/helpers/error"

const useUserDefaultMintingWallets = () => {
  const api = new WalletApi()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [ethWallet, setEthWallet] = useState<WalletDto | undefined>()
  const [solWallet, setSolWallet] = useState<WalletDto | undefined>()

  async function getDefaultWallet(chain: GetDefaultWalletRequestDtoChainEnum) {
    try {
      setIsLoading(true)
      const wallet = await api.getDefaultWallet({
        getDefaultWalletRequestDto: { chain }
      })
      switch (chain) {
        case "eth":
          setEthWallet(wallet)
          break
        case "sol":
          setSolWallet(wallet)
          break
      }
    } catch (error: any) {
      errorMessage(error, true)
    } finally {
      setIsLoading(false)
    }
  }

  async function setDefaultWallet(
    walletId: string,
    chain: GetDefaultWalletRequestDtoChainEnum
  ) {
    try {
      await api.setDefaultWallet({
        setDefaultWalletRequestDto: { walletId, chain }
      })
      await getDefaultWallet(chain)
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  useEffect(() => {
    getDefaultWallet("eth")
    getDefaultWallet("sol")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isLoading,
    ethWallet,
    solWallet,
    getDefaultWallet,
    setDefaultWallet
  }
}

export default useUserDefaultMintingWallets
