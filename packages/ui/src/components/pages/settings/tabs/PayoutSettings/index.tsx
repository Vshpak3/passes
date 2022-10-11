import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { PayoutMethodDtoMethodEnum } from "@passes/api-client"
import classNames from "classnames"
import { useRouter } from "next/router"
import Clipboard from "public/icons/clipboard.svg"
import { useEffect } from "react"
import { Button } from "src/components/atoms/Button"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/settings"
import { copyWalletToClipboard, formatWalletAddress } from "src/helpers/wallets"
import { usePayoutMethod } from "src/hooks/usePayoutMethod"
import { useUser } from "src/hooks/useUser"
import { useUserConnectedWallets } from "src/hooks/useUserConnectedWallets"
import { BankIcon } from "src/icons/bank-icon"
import { WalletIcon } from "src/icons/wallet-icon"

const PayoutSettings = () => {
  const { addOrPopStackHandler } = useSettings() as SettingsContextProps
  const {
    banks,
    defaultBank,
    setDefaultPayoutMethod,
    defaultPayoutMethod,
    deleteBank
  } = usePayoutMethod()

  const { wallets } = useUserConnectedWallets()

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
      <Tab
        withBackMobile
        title="Payout Settings"
        description="Add and manage payout methods."
      />
      <div className="my-8 flex flex-col gap-6 xl:flex-row">
        <div
          className={classNames(
            defaultPayoutMethod
              ? "flex-col items-start justify-start"
              : "items-center justify-between",
            "flex w-full gap-2 rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 py-6 px-6"
          )}
        >
          <span className="text-[14px] font-[700]">Default Payout Method:</span>
          {defaultBank ? (
            <div>
              <span className="text-[16px] font-[700]">
                {defaultBank?.description.split(",")[0]}
                {payoutWallet?.address}
              </span>
              <span className="text-[16px] font-[500]">
                {defaultBank?.country}
              </span>
            </div>
          ) : (
            <div className="mr-2 rounded-full border-2 border-passes-dark-200 py-2 px-4 font-[500]">
              None
            </div>
          )}
        </div>
      </div>
      <div className="mb-4 flex flex-col">
        <div className="mb-4 font-bold">
          Add Crypto Wallet as a Payout Method
        </div>
        <div>
          <Button
            icon={<WalletIcon />}
            variant="pink"
            tag="button"
            className="w-auto"
            onClick={() => addOrPopStackHandler(SubTabsEnum.WalletSettings)}
          >
            Manage wallets
          </Button>
        </div>
      </div>
      {!wallets || wallets?.length === 0 ? (
        <div className="mt-6 flex w-[700px] items-center justify-center rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-7">
          <span>No Wallets Found</span>
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex flex-row pb-3">
            <span className="basis-1/4 text-center">Walet type</span>
            <span className="basis-1/2 text-center">Address</span>
            <span className="basis-1/4 text-center">Default for</span>
          </div>
          {wallets
            ?.filter((wallet) => !wallet.custodial)
            .map((wallet) => {
              return (
                <div
                  className="
                mb-3
                flex
                items-center
                justify-between
                border-t
                border-[#2C282D]
                py-4"
                  key={wallet.walletId}
                >
                  <span className="basis-1/4 text-center">{wallet.chain}</span>
                  <span
                    className="group flex basis-1/2 cursor-pointer flex-row justify-center text-center"
                    onClick={() => copyWalletToClipboard(wallet.address)}
                  >
                    {formatWalletAddress(wallet.address, {
                      amountFirst: 6,
                      amountLast: 7
                    })}
                    <Clipboard
                      width="12px"
                      className="invisible ml-2 group-hover:visible group-hover:visible"
                    />
                  </span>
                  <span className="basis-1/4 text-center">
                    <Button
                      disabled={payoutWallet?.walletId === wallet.walletId}
                      onClick={async () => {
                        await setDefaultPayoutMethod({
                          walletId: wallet.walletId,
                          method: PayoutMethodDtoMethodEnum.CircleUsdc
                        })
                      }}
                    >
                      {payoutWallet?.walletId === wallet.walletId
                        ? "Default"
                        : "Set Payout Default"}
                    </Button>
                  </span>
                </div>
              )
            })}
        </div>
      )}
      <div className="mt-6">
        <div className="mb-4 font-bold">Add Bank as a Payout Method</div>
        <Button
          icon={<BankIcon />}
          variant="pink"
          className="w-auto"
          tag="button"
          onClick={() => addOrPopStackHandler(SubTabsEnum.AddBank)}
        >
          Add bank
        </Button>
        {(!banks || banks.length === 0) && (
          <div className="mt-6 flex w-full items-center justify-center rounded-[20px] border border-passes-dark-200 bg-[#1B141D]/50 p-7">
            <span>No Saved Bank Payout Methods</span>
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
                    disabled={defaultBank?.id === bank.id}
                    className={
                      defaultBank?.id === bank.id
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
                      {defaultBank?.id === bank?.id ? "Default" : "Set Default"}
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
      </div>
    </>
  )
}

export default PayoutSettings // eslint-disable-line import/no-default-export
