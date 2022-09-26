import { CircleBankDto, PaymentApi, PayoutMethodDto } from "@passes/api-client"
import { useRouter } from "next/router"
import DeleteIcon from "public/icons/delete-outline.svg"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"

import { useUser } from "../../../hooks"
import BankIcon from "../../../icons/bank-icon"
import WalletIcon from "../../../icons/wallet-icon"
import { Button, PassesPinkButton } from "../../atoms"

const DefaultPayoutMethod = () => {
  const [banks, setBanks] = useState<CircleBankDto[]>([])
  const [defaultPayout, setDefaultPayout] = useState<PayoutMethodDto>()

  const { user, loading } = useUser()
  const router = useRouter()

  const getDefaultPayout = useCallback(async (api: PaymentApi) => {
    try {
      setDefaultPayout(await api.getDefaultPayoutMethod())
    } catch (error: any) {
      toast.error(error)
      setDefaultPayout(undefined)
    }
  }, [])

  const filteredDefaultPayout = banks.find(
    (bank) => bank.id === defaultPayout?.bankId
  )

  const getBanks = useCallback(async (paymentApi: PaymentApi) => {
    setBanks((await paymentApi.getCircleBanks()).banks)
  }, [])

  const deleteBank = async (bankId: string) => {
    const paymentApi = new PaymentApi()
    try {
      await paymentApi.deleteCircleBank({ circleBankId: bankId })
    } catch (error: any) {
      toast.error(error)
    } finally {
      await getBanks(paymentApi)
      await getDefaultPayout(paymentApi)
    }
  }

  const setDefaultPayoutMethod = async (bankId: string) => {
    const paymentApi = new PaymentApi()
    try {
      await paymentApi.setDefaultPayoutMethod({
        setPayoutMethodRequestDto: {
          method: "none",
          bankId: bankId
        }
      })
    } catch (error: any) {
      toast.error(error)
    } finally {
      await getBanks(paymentApi)
      await getDefaultPayout(paymentApi)
    }
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    if (!user) {
      router.push("/login")
    }
    const fetchData = async () => {
      const paymentApi = new PaymentApi()
      await getBanks(paymentApi)
      await getDefaultPayout(paymentApi)
    }
    fetchData()
  }, [router, user, loading, getBanks, getDefaultPayout])

  const BankAccountMethod = () => {
    const noBankAccount = !filteredDefaultPayout?.id

    return (
      <div className="flex w-full items-center justify-center rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-10">
        {noBankAccount ? (
          <div className="flex flex-col items-center gap-10">
            <span className="text-center text-[24px] font-[700]">
              Set Bank Account as a Default Payout Method
            </span>
            <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
              <PassesPinkButton
                className="h-[41px] w-[200px]"
                name="Set Default"
                onClick={() =>
                  setDefaultPayoutMethod(filteredDefaultPayout?.id ?? "")
                }
              />
              <Button
                variant="purple"
                icon={<BankIcon width={25} height={25} />}
                onClick={() => router.push("/payment/default-payout-method")}
              >
                Manage Bank
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col gap-4">
                <span className="text-[24px] font-[700]">IDR / BCA</span>
                <span className="text-[16px] font-[500]">*******8920</span>
              </div>
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <PassesPinkButton
                  className={
                    "h-[41px] w-[200px] " +
                    (filteredDefaultPayout.id &&
                      " border-passes-dark-200 bg-transparent")
                  }
                  name={filteredDefaultPayout.id ? "Default" : "Set Default"}
                  onClick={() =>
                    setDefaultPayoutMethod(filteredDefaultPayout?.id ?? "")
                  }
                />
                <Button
                  variant="purple"
                  icon={<WalletIcon width={25} height={25} />}
                  onClick={() => router.push("/payment/default-payout-method")}
                >
                  Manage Wallet
                </Button>
                <div
                  onClick={() => deleteBank(filteredDefaultPayout?.id ?? "")}
                  className="flex h-[41px] w-[41px] cursor-pointer items-center justify-center rounded-full bg-passes-dark-200 p-2 hover:opacity-[0.5]"
                >
                  <DeleteIcon className="fill-white" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:gap-16">
              <div className="flex flex-col">
                <span className="text-[16px] font-[500] opacity-[0.5]">
                  Transfer Type
                </span>
                <span className="text-[16px] font-[500]">Domestic</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-[500] opacity-[0.5]">
                  Bank Country
                </span>
                <span className="text-[16px] font-[500]">USA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[16px] font-[500] opacity-[0.5]">
                  We&apos;ll use this bank account for:
                </span>
                <span className="text-[16px] font-[500]">
                  Transfers to this account will always be made in IDR.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const WalletMethod = () => {
    const noWallet = true
    return (
      <div className="flex max-w-[371px] items-center justify-center rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-10">
        {noWallet ? (
          <div className="flex flex-col items-center gap-10">
            <span className="text-center text-[24px] font-[700]">
              Set Wallet as a Default Payout Method
            </span>
            <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
              <PassesPinkButton
                className="h-[41px] w-[200px]"
                name="Set Default"
                onClick={() =>
                  setDefaultPayoutMethod(filteredDefaultPayout?.id ?? "")
                }
              />
              <Button
                variant="purple"
                icon={<WalletIcon width={25} height={25} />}
                onClick={() => router.push("/payment/default-payout-method")}
              >
                Manage Wallet
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <span className="text-[16px] font-[500]">
              Default Wallet Address:
            </span>
            <div className="flex flex-row">
              <span className="text-[24px] font-[700]">Axy...56huad</span>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row">
              <PassesPinkButton
                className="h-[41px] w-[200px]"
                name="Set Default"
                onClick={() =>
                  setDefaultPayoutMethod(filteredDefaultPayout?.id ?? "")
                }
              />
              <Button
                variant="purple"
                icon={<WalletIcon width={25} height={25} />}
                onClick={() => router.push("/payment/default-payout-method")}
              >
                Manage Wallet
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="my-4 flex flex-row items-center justify-between gap-x-4">
        <span className="text-[24px] font-bold text-[#ffff]/90">
          Default Payout Method
        </span>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row ">
        <BankAccountMethod />
        <WalletMethod />
      </div>
    </div>
  )
}

export default DefaultPayoutMethod
