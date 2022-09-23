import { CircleBankDto, PaymentApi, PayoutMethodDto } from "@passes/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const usePayoutMethod = () => {
  const [defaultPayoutMethod, setDefaultPayoutMethod] =
    useState<PayoutMethodDto>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [banks, setBanks] = useState<CircleBankDto[]>([])
  const api = new PaymentApi()

  async function getDefaultPayoutMethod() {
    try {
      setIsLoading(true)

      const response = await api.getDefaultPayoutMethod()

      setDefaultPayoutMethod(response)
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

  async function updateDefaultPayoutMethod(dto: PayoutMethodDto) {
    try {
      setIsLoading(true)
      await api.setDefaultPayoutMethod({
        setPayoutMethodRequestDto: dto
      })

      getDefaultPayoutMethod()
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
    defaultPayoutMethod,
    isLoadingPayoutMethod: isLoading,
    setDefaultPayoutMethod: updateDefaultPayoutMethod,
    deleteBank
  }
}

export default usePayoutMethod
