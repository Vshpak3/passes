import {
  CircleBankDto,
  PaymentApi,
  PayoutMethodDto,
  PayoutMethodDtoMethodEnum,
  WalletApi,
  WalletDto
} from "@passes/api-client"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "src/components/atoms"
import { useUser } from "src/hooks"
import { withPageLayout } from "src/layout/WithPageLayout"

import AddBankingModal from "../../components/organisms/AddBankingModal"
import AddWalletModal from "../../components/organisms/AddWalletModal"
import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"
import { wrapApi } from "../../helpers"
import BankIcon from "../../icons/bank-icon"
import AccountCard from "./AccountCard"

const DefaultPayoutMethod = () => {
  const [banks, setBanks] = useState<CircleBankDto[]>([])
  const [wallets, setWallets] = useState<WalletDto[]>([])
  const [isWalletModalOpen, setWalletModalOpen] = useState(false)
  const [isBankingModalOpen, setBankingModalOpen] = useState(false)
  const [defaultPayout, setDefaultPayout] = useState<PayoutMethodDto>()

  const filteredDefaultPayout = banks.find(
    (bank) => bank.id === defaultPayout?.bankId
  )
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

  const getBanks = useCallback(async (paymentApi: PaymentApi) => {
    setBanks((await paymentApi.getCircleBanks()).banks)
  }, [])

  const getWallets = useCallback(async (walletApi: WalletApi) => {
    setWallets((await walletApi.getWallets()).wallets)
  }, [])

  const submit = async (dto: PayoutMethodDto) => {
    const paymentApi = wrapApi(PaymentApi)
    try {
      await paymentApi.setDefaultPayoutMethod({
        setPayoutMethodRequestDto: dto
      })
    } catch (error: any) {
      toast.error(error)
    } finally {
      await getDefaultPayout(paymentApi)
    }
  }

  const deleteBank = async (bankId: string) => {
    const paymentApi = wrapApi(PaymentApi)
    try {
      await paymentApi.deleteCircleBank({ circleBankId: bankId })
    } catch (error: any) {
      toast.error(error)
    } finally {
      await getBanks(paymentApi)
      await getDefaultPayout(paymentApi)
    }
  }

  const deleteWallet = async (walletId: string) => {
    const walletApi = wrapApi(WalletApi)
    const paymentApi = wrapApi(PaymentApi)
    try {
      await walletApi.removeWallet({ walletId: walletId })
    } catch (error) {
      console.error(error)
    } finally {
      await getWallets(walletApi)
      await getDefaultPayout(paymentApi)
    }
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      console.log("r2")
      return
    }
    if (!user) {
      router.push("/login")
    }
    const fetchData = async () => {
      const paymentApi = wrapApi(PaymentApi)
      const walletApi = wrapApi(WalletApi)
      await getBanks(paymentApi)
      await getWallets(walletApi)
      await getDefaultPayout(paymentApi)
    }
    fetchData()
  }, [router, user, loading, getBanks, getWallets, getDefaultPayout])

  return (
    <AuthOnlyWrapper isPage>
      <div>
        <div className="mx-auto -mt-[195px] grid grid-cols-10 gap-5 px-4 text-[#ffff]/90 sm:w-[653px] md:w-[653px] lg:w-[900px] lg:px-0 sidebar-collapse:w-[1000px]">
          <div className="col-span-12 w-full">
            <div className="mb-16 text-base font-medium leading-[19px]">
              <div className="my-4 flex items-center justify-between gap-x-4">
                <span className="text-[24px] font-bold text-[#ffff]/90">
                  Settings
                </span>
                <Button
                  variant="purple"
                  icon={<BankIcon width={25} height={25} />}
                  onClick={() => {
                    setWalletModalOpen(true)
                  }}
                >
                  Add Wallet
                </Button>
                <Button
                  variant="purple"
                  icon={<BankIcon width={25} height={25} />}
                  onClick={() => {
                    setBankingModalOpen(true)
                  }}
                >
                  Add Bank
                </Button>
              </div>
            </div>
          </div>
          {/* DEFAULT PAYOUT */}
          <div className="col-span-10 w-full md:space-y-6">
            <div className="mb-16 text-base font-medium leading-[19px] lg:h-full">
              <div className="flex flex-col justify-around rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px] lg:h-full">
                <div className="flex flex-col">
                  {filteredDefaultPayout?.description}
                </div>
                <div className="flex flex-row justify-between gap-16">
                  <div className="flex flex-col">
                    <span className="text-sm text-[#ffff]/70 lg:self-start">
                      Transfer type
                    </span>
                    <span className="text-sm text-[#ffff]/70 lg:self-start">
                      Domestic {/* Domestic or Foreign */}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-[#ffff]/70 lg:self-start">
                      Bank Country
                    </span>
                    <span className="text-sm text-[#ffff]/70 lg:self-start">
                      USA {/* Domestic or Foreign */}
                    </span>
                  </div>
                  <div className="flex grow flex-col">
                    <span className="text-sm text-[#ffff]/70 lg:self-start">
                      We&apos;ll use this bank account for:
                    </span>
                    <span className="text-sm text-[#ffff]/70 lg:self-start">
                      Transfer to this account will always be made in IDR.
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <Button variant="pink" disabled>
                      Set Default
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* DEFAULT PAYOUT */}
          {/* List of bank accounts */}
          {banks.map((account) => {
            return (
              <div key={account.id} className="col-span-10 w-full md:space-y-6">
                <AccountCard
                  account={account}
                  handleClick={() => {
                    submit({
                      bankId: account.id.toString(),
                      method: PayoutMethodDtoMethodEnum.CircleUsdc
                    })
                  }}
                  deleteBank={() => deleteBank(account.id)}
                />
              </div>
            )
          })}
          {/* List of walletes */}
          {wallets.map((wallet) => {
            return (
              <div
                key={wallet.walletId}
                className="col-span-10 w-full md:space-y-6"
              >
                <AccountCard
                  wallet={wallet}
                  handleClick={() => {
                    submit({
                      walletId: wallet.walletId,
                      method: PayoutMethodDtoMethodEnum.CircleUsdc
                    })
                  }}
                  deleteWallet={() => deleteWallet(wallet.walletId)}
                />
              </div>
            )
          })}
        </div>
        <p>
          Your current payout method: {defaultPayout === undefined && "none"}
          {defaultPayout !== undefined &&
            "method - " +
              defaultPayout.method +
              " | bankId - " +
              defaultPayout.bankId +
              " | walletId - " +
              defaultPayout.walletId}
        </p>
        <br />
        {banks?.map((bank, i) => {
          return (
            <div key={i}>
              <button
                onClick={() => {
                  submit({
                    bankId: bank.id,
                    method: PayoutMethodDtoMethodEnum.CircleWire
                  })
                }}
                {...(bank.status !== "complete" ? { disabled: true } : {})}
              >
                Bank: {bank.description}
                status: {bank.status}
              </button>

              <br />
              <button
                onClick={() => {
                  deleteBank(bank.id)
                }}
              >
                delete
              </button>
              <br />
            </div>
          )
        })}
        {wallets?.map((wallet, i) => {
          return (
            <div key={i}>
              <button
                onClick={() => {
                  submit({
                    walletId: wallet.walletId,
                    method: PayoutMethodDtoMethodEnum.CircleUsdc
                  })
                }}
              >
                Address: {wallet.address}
                chain: {wallet.chain}
              </button>

              <br />
            </div>
          )
        })}
      </div>
      <AddBankingModal
        isOpen={isBankingModalOpen}
        setOpen={setBankingModalOpen}
        defaultPayout={defaultPayout}
      />
      <AddWalletModal
        isOpen={isWalletModalOpen}
        setOpen={setWalletModalOpen}
        defaultPayout={defaultPayout}
      />
    </AuthOnlyWrapper>
  )
}

export default withPageLayout(DefaultPayoutMethod)
