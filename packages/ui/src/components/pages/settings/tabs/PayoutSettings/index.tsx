import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { PayoutMethodDtoMethodEnum } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Button } from "src/components/atoms"
import Tab from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import { usePayoutMethod, useUser, useUserConnectedWallets } from "src/hooks"
import BankIcon from "src/icons/bank-icon"
import WalletIcon from "src/icons/wallet-icon"
const PayoutSettings = () => {
  const { addOrPopStackHandler } = useSettings() as ISettingsContext
  const { banks, setDefaultPayoutMethod, defaultPayoutMethod, deleteBank } =
    usePayoutMethod()

  const { wallets } = useUserConnectedWallets()

  const payoutBank = banks.find(
    (bank) => bank.id === defaultPayoutMethod?.bankId
  )
  const payoutWallet = wallets?.find(
    (wallet) => wallet.walletId === defaultPayoutMethod?.walletId
  )

  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }
    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])

  return (
    <>
      <Tab withBackMobile title="Payout Settings" />
      {/*<div className="flex items-center justify-between">
        <span className="text-[16px] font-[500]">To download W9 form</span>
        <DownloadW9FormButton />
      </div>
      <div className="mt-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-[500]">To edit W9 form</span>
          <div
            className="tooltip"
            data-tip="Please, mannually fill out the W9 Form, and upload filled out W9 Form here."
          >
            <InfoIcon />
          </div>
        </div>
        <UploadW9FormButton text="Upload W9 Form" icon={true} />
  </div>*/}
      <div className="my-8 flex flex-col gap-6 xl:flex-row">
        <div className="flex w-[248px] flex-col justify-center gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-6">
          <span className="text-[14px] font-[400] opacity-90">
            Default Payout Method:
          </span>
          <div className="flex gap-6">
            <span className="text-[16px] font-[700]">
              {payoutBank?.description.split(",")[0]}
              {payoutWallet?.address}
            </span>
            <span className="text-[16px] font-[500]">
              {payoutBank?.country}
            </span>
          </div>
        </div>
      </div>
      <div>
        <Button
          icon={<WalletIcon />}
          variant="purple-light"
          tag="button"
          className="!px-4 !py-2.5"
          onClick={() => addOrPopStackHandler(SubTabsEnum.WalletSettings)}
        >
          Manage wallets
        </Button>
      </div>
      Payable addresses (non custodial)
      <div>
        {(!wallets || wallets?.length === 0) && (
          <div className="mt-6 flex w-[700px] items-center justify-center rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-7">
            <span>No Wallets Found</span>
          </div>
        )}
        {wallets
          ?.filter((wallet) => !wallet.custodial)
          .map((wallet) => {
            return (
              <div
                className="
                mb-[11px]
                flex
                items-center
                justify-between
                border-t
                border-[#2C282D]
                pt-[11px]
                pl-[20px]"
                key={wallet.walletId}
              >
                <div>{wallet.address}</div>
                <div> {wallet.chain.toUpperCase()} USDC</div>
                <button
                  disabled={payoutWallet?.walletId === wallet.walletId}
                  onClick={async () => {
                    console.log("setting")
                    await setDefaultPayoutMethod({
                      walletId: wallet.walletId,
                      method: PayoutMethodDtoMethodEnum.CircleUsdc
                    })
                  }}
                >
                  {payoutWallet?.walletId === wallet.walletId ? "Is " : "Set "}
                  default
                </button>
              </div>
            )
          })}
      </div>
      <Button
        icon={<BankIcon />}
        variant="purple-light"
        tag="button"
        className="!px-4 !py-2.5"
        onClick={() => addOrPopStackHandler(SubTabsEnum.AddBank)}
      >
        Add bank
      </Button>
      {(!banks || banks.length === 0) && (
        <div className="mt-6 flex w-[700px] items-center justify-center rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-7">
          <span>No Bank Account Found</span>
        </div>
      )}
      {banks?.map((bank) => (
        <div
          key={bank.id}
          className="mb-6 mt-6 flex flex-col gap-5 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-7"
        >
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <span className="text-[24px] font-[700]">
                {bank.description.split(",")[0]}
              </span>
              <span className="text-[16px] font-[500]">
                {bank.description.split(",")[1]}
              </span>
            </div>
            <div className="flex w-[241px] flex-col">
              <span className="text-[16px] font-[500]">
                We&apos;ll use this bank account for:
              </span>
              <span className="text-[12px] font-[500] opacity-50">
                Transfers to this account will always be made in IDR.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <div className="flex flex-[0.2] flex-col">
              <span className="text-[12px] font-[500] opacity-50">
                Transfer type
              </span>
              <span className="text-[16px] font-[500]">
                {bank.country === "US" ? "Domestic" : "International"}
              </span>
            </div>
            <div className="flex flex-[0.2] flex-col">
              <span className="text-[12px] font-[500] opacity-50">
                Bank country
              </span>
              <span className="text-[16px] font-[500]">{bank.country}</span>
            </div>
            <div className="flex flex-[0.4] flex-col">
              <span className="text-[12px] font-[500] opacity-50">
                We&apos;ll use this bank account for:
              </span>
              <span className="text-[14px] font-[500]">
                Transfers to this account will always be made in IDR.
              </span>
            </div>
            <div className="flex flex-[0.4] flex-col">
              <span className="text-[12px] font-[500] opacity-50">
                Set Default
              </span>
              <div className="flex flex-row gap-2">
                <button
                  disabled={payoutBank?.id === bank.id}
                  className={
                    payoutBank?.id === bank.id
                      ? "flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-[6px] border border-white/70 bg-transparent px-2 text-white"
                      : "flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-passes-primary-color bg-passes-primary-color px-2 text-white"
                  }
                  onClick={() =>
                    setDefaultPayoutMethod({
                      bankId: bank.id,
                      method: PayoutMethodDtoMethodEnum.CircleWire
                    })
                  }
                >
                  <span className="text-[16px] font-[500]">
                    {payoutBank?.id === bank?.id ? "Default" : "Set Default"}
                  </span>
                </button>

                <button
                  className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 text-white"
                  onClick={() => deleteBank(bank.id)}
                >
                  <BankIcon width={25} height={25} />
                  <span className="text-[16px] font-[500]">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default PayoutSettings
