import { CircleBankDto, PaymentApi, PayoutMethodDto } from "@passes/api-client"
import { useEffect, useState } from "react"
import useSWR from "swr"

export const usePayoutMethod = () => {
  const api = new PaymentApi()
  const {
    data: payoutMethod,
    isValidating: isLoadingPayoutMethod,
    mutate: mutatePayoutMethod
  } = useSWR<PayoutMethodDto>("/payment/default-payout-method", async () => {
    setTimeout(() => undefined, 500)
    return await api.getDefaultPayoutMethod()
  })

  const {
    data: banks,
    isValidating: isLoadingBanks,
    mutate: mutateBanks
  } = useSWR<CircleBankDto[]>("/payment/banks", async () => {
    setTimeout(() => undefined, 500)
    return (await api.getCircleBanks()).banks
  })

  const [defaultBank, setDefaultBank] = useState<CircleBankDto>()

  async function setDefaultPayoutMethod(dto: PayoutMethodDto) {
    await api.setDefaultPayoutMethod({
      setPayoutMethodRequestDto: dto
    })
    mutatePayoutMethod(dto)
  }

  async function deleteBank(bankId: string) {
    await api.deleteCircleBank({
      circleBankId: bankId
    })
    mutateBanks()
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
    setDefaultBank(banks?.find((bank) => bank.id === payoutMethod?.bankId))
  }, [banks, payoutMethod])

  return {
    banks,
    defaultPayoutMethod: payoutMethod,
    isLoadingPayoutMethod,
    isLoadingBanks,
    setDefaultPayoutMethod,
    defaultBank,
    deleteBank
  }
}
