import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { PayoutMethodDtoMethodEnum } from "@passes/api-client"
import classNames from "classnames"
import Clipboard from "public/icons/clipboard.svg"
import DeleteIcon from "public/icons/delete-outline.svg"
import { memo } from "react"

import { Button } from "src/components/atoms/Button"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { copyWalletToClipboard, formatWalletAddress } from "src/helpers/wallets"
import { usePayoutMethod } from "src/hooks/usePayoutMethod"
import { BankIcon } from "src/icons/BankIcon"
import { WalletIcon } from "src/icons/WalletIcon"

const PayoutSettings = () => {
  const { addOrPopStackHandler } = useSettings() as SettingsContextProps
  const {
    banks,
    defaultBank,
    setDefaultPayoutMethod,
    defaultPayoutMethod,
    deleteBank,
    defaultWallet,
    wallets
  } = usePayoutMethod()

  const renderDefaultBank = () => (
    <div className="flex basis-3/4 flex-col justify-between">
      <span className="mb-4 font-[700]">
        {defaultBank?.description.split(",")[0]}
      </span>
      <div className="flex flex-row">
        <span className="mr-6 font-[500]">
          {defaultBank?.description.split(",")[1]}
        </span>
        <div className="mr-6">
          <span className="mr-2 text-[12px] font-[500] opacity-50">
            Transfer type
          </span>
          <span className="text-[16px] font-[500]">
            {defaultBank?.country === "US" ? "Domestic" : "International"}
          </span>
        </div>
        <div className="flex flex-row">
          <span className="mr-2 text-[12px] font-[500] opacity-50">
            Bank country
          </span>
          <span className="text-[16px] font-[500]">{defaultBank?.country}</span>
        </div>
      </div>
    </div>
  )

  const renderDefaultPayoutMethod = () => {
    return (
      <div>
        <div className="text-[16px]">
          {defaultWallet?.address ? (
            <div className="flex flex-col text-[12px] md:flex-row md:text-[16px]">
              <span className="mr-4">Wallet:</span>
              <span>{defaultWallet.address}</span>
            </div>
          ) : (
            renderDefaultBank()
          )}
        </div>
      </div>
    )
  }

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
            defaultPayoutMethod &&
              defaultPayoutMethod.method !== PayoutMethodDtoMethodEnum.None
              ? "flex-col items-start justify-start"
              : "items-center justify-between",
            "flex w-full gap-2 rounded-[15px] border border-passes-dark-200 bg-[#1B141D]/50 p-4 md:p-6"
          )}
        >
          <span className="text-[14px] font-[700]">Default Payout Method:</span>
          {defaultPayoutMethod &&
          defaultPayoutMethod.method !== PayoutMethodDtoMethodEnum.None ? (
            renderDefaultPayoutMethod()
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
        <div className="mt-6 flex w-full items-center justify-center rounded-[15px] border border-passes-dark-200 bg-[#1B141D]/50 p-7">
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
                  className="mb-3 flex items-center justify-between border-t border-[#2C282D] py-4"
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
                      className="invisible ml-2 group-hover:visible"
                    />
                  </span>
                  <span className="basis-1/4 text-center">
                    <Button
                      disabled={defaultWallet?.walletId === wallet.walletId}
                      variant="pink"
                      className="w-auto"
                      onClick={async () => {
                        await setDefaultPayoutMethod({
                          walletId: wallet.walletId,
                          method: PayoutMethodDtoMethodEnum.CircleUsdc
                        })
                      }}
                    >
                      {defaultWallet?.walletId === wallet.walletId
                        ? "Default"
                        : "Set Payout Default"}
                    </Button>
                  </span>
                </div>
              )
            })}
        </div>
      )}
      <div className="my-6">
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
          <div className="mt-6 flex w-full items-center justify-center rounded-[15px] border border-passes-dark-200 bg-[#1B141D]/50 p-7">
            <span>No Saved Bank Payout Methods</span>
          </div>
        )}
        {banks?.map((bank) => (
          <div
            key={bank.id}
            className="my-6 flex flex-row gap-5 rounded-[15px] border border-passes-dark-200 bg-[#1B141D]/50 p-7"
          >
            <div className="flex basis-3/4 flex-col justify-between">
              <span className="mb-6 font-[700]">
                {bank.description.split(",")[0]}
              </span>
              <div className="flex flex-row">
                <span className="mr-6 font-[500]">
                  {bank.description.split(",")[1]}
                </span>
                <div className="mr-6">
                  <span className="mr-2 text-[12px] font-[500] opacity-50">
                    Transfer type
                  </span>
                  <span className="text-[16px] font-[500]">
                    {bank.country === "US" ? "Domestic" : "International"}
                  </span>
                </div>
                <div className="flex flex-row">
                  <span className="mr-2 text-[12px] font-[500] opacity-50">
                    Bank country
                  </span>
                  <span className="text-[16px] font-[500]">{bank.country}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="flex flex-col">
                <div className="flex flex-row gap-2">
                  <Button
                    disabled={defaultBank?.id === bank.id}
                    variant={
                      defaultBank?.id === bank.id ? "pink" : "purple-light"
                    }
                    className="w-auto"
                    onClick={() =>
                      setDefaultPayoutMethod({
                        bankId: bank.id,
                        method: PayoutMethodDtoMethodEnum.CircleWire
                      })
                    }
                  >
                    <span className="text-[16px] font-[500]">
                      {defaultBank?.id === bank?.id
                        ? "Default"
                        : "Set Payout Default"}
                    </span>
                  </Button>
                  <button
                    onClick={() => deleteBank(bank.id)}
                    className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/10"
                  >
                    <DeleteIcon width="25px" height="25px" />
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

export default memo(PayoutSettings) // eslint-disable-line import/no-default-export
