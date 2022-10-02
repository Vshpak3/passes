import {
  CircleBankDto,
  PaymentApi,
  PayoutMethodDto,
  PayoutMethodDtoMethodEnum
} from "@passes/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const usePayoutMethod = () => {
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethodDto>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [banks, setBanks] = useState<CircleBankDto[]>([])
  const api = new PaymentApi()

  async function getDefaultPayoutMethod() {
    try {
      setIsLoading(true)

      const response = await api.getDefaultPayoutMethod()

      setPayoutMethod(response)
    } catch (error: any) {
      console.error(error)
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function getBanks() {
    try {
      setIsLoading(true)
      const response = await api.getCircleBanks()
      setBanks(response.banks)
    } catch (error: any) {
      console.error(error)
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function setDefaultPayoutMethod(dto: PayoutMethodDto) {
    try {
      setIsLoading(true)
      await api.setDefaultPayoutMethod({
        setPayoutMethodRequestDto: dto
      })
      setPayoutMethod(dto)
    } catch (error: any) {
      console.error(error)
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteBank(bankId: string) {
    try {
      setIsLoading(true)
      await api.deleteCircleBank({
        circleBankId: bankId
      })
      if (payoutMethod?.bankId === bankId) {
        setPayoutMethod({ method: PayoutMethodDtoMethodEnum.None })
      }
      setBanks(banks.filter((bank) => bank.id != bankId))
    } catch (error: any) {
      console.error(error)
      toast.error(error)
    } finally {
      await getBanks()
    }
  }

  useEffect(() => {
    getDefaultPayoutMethod()
    getBanks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    banks,
    defaultPayoutMethod: payoutMethod,
    isLoadingPayoutMethod: isLoading,
    setDefaultPayoutMethod,
    deleteBank
  }
}

export default usePayoutMethod
