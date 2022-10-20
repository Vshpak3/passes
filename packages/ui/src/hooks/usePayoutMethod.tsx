import {
  CircleBankDto,
  PaymentApi,
  PayoutMethodDto,
  WalletDto
} from "@passes/api-client"
import { useEffect, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

import { useUserConnectedWallets } from "./useUserConnectedWallets"

const CACHE_KEY_PAYOUT_METHOD = "/payment/default-payout-method"
const CACHE_KEY_BANKS = "/payment/banks"

export const usePayoutMethod = () => {
  const { wallets } = useUserConnectedWallets()
  const api = new PaymentApi()
  const {
    data: payoutMethod,
    isValidating: isLoadingPayoutMethod,
    mutate: mutatePayoutMethod
  } = useSWR<PayoutMethodDto>(CACHE_KEY_PAYOUT_METHOD, async () => {
    setTimeout(() => undefined, 500)
    return await api.getDefaultPayoutMethod()
  })

  const {
    data: banks,
    isValidating: isLoadingBanks,
    mutate: mutateBanks
  } = useSWR<CircleBankDto[]>(CACHE_KEY_BANKS, async () => {
    setTimeout(() => undefined, 500)
    return (await api.getCircleBanks()).banks
  })

  const [defaultBank, setDefaultBank] = useState<CircleBankDto>()
  const [defaultWallet, setDefaultWallet] = useState<WalletDto>()

  const { mutate: _mutateManual } = useSWRConfig()
  const mutateManualPayoutMethod = (update: PayoutMethodDto) =>
    _mutateManual(CACHE_KEY_PAYOUT_METHOD, update, {
      populateCache: (update: PayoutMethodDto) => {
        return update
      },
      revalidate: false
    })
  const mutateManualBanks = (update: CircleBankDto[]) =>
    _mutateManual(CACHE_KEY_BANKS, update, {
      populateCache: (update: CircleBankDto[]) => {
        return update
      },
      revalidate: false
    })

  async function setDefaultPayoutMethod(dto: PayoutMethodDto) {
    await api.setDefaultPayoutMethod({
      setPayoutMethodRequestDto: dto
    })
    mutateManualPayoutMethod(dto)
  }

  async function deleteBank(bankId: string) {
    await api.deleteCircleBank({
      circleBankId: bankId
    })
    mutateManualBanks(banks?.filter((bank) => bank.id !== bankId) ?? [])
  }

  useEffect(() => {
    if (!payoutMethod) {
      mutatePayoutMethod()
    }
    if (!banks) {
      mutateBanks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setDefaultWallet(
      wallets?.find((wallet) => wallet.walletId === payoutMethod?.walletId)
    )
  }, [wallets, payoutMethod])
  useEffect(() => {
    setDefaultBank(banks?.find((bank) => bank.id === payoutMethod?.bankId))
  }, [banks, payoutMethod])

  return {
    banks,
    defaultPayoutMethod: payoutMethod,
    isLoadingPayoutMethod,
    isLoadingBanks,
    setDefaultPayoutMethod,
    defaultBank,
    defaultWallet,
    deleteBank,
    wallets
  }
}
