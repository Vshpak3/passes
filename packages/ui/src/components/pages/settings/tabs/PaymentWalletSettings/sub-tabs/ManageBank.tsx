import { PayoutMethodDto, PayoutMethodDtoMethodEnum } from "@passes/api-client"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { Button } from "src/components/atoms"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import BankIcon from "src/icons/bank-icon.svg"

import { usePayout, useUser } from "../../../../../../hooks"
import Tab from "../../../Tab"

const ManageBank = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext

  const { user, loading } = useUser()
  const router = useRouter()
  const {
    banks,
    setDefaultPayoutMethod,
    defaultPayoutMethod: defaultPayout,
    deleteBank
  } = usePayout()

  const filteredDefaultPayout = banks.find(
    (bank) => bank.id === defaultPayout?.bankId
  )

  const setDefaultPayout = async (dto: PayoutMethodDto) => {
    setDefaultPayoutMethod(dto)
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      console.log("r2")
      return
    }
    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])
  return (
    <Tab
      title="Manage Bank"
      TitleBtn={
        <Button
          icon={<BankIcon />}
          variant="purple-light"
          tag="button"
          className="!px-6 !py-2.5 font-medium"
          onClick={() => addTabToStackHandler(SubTabsEnum.AddBank)}
        >
          Add Bank
        </Button>
      }
      withBack
    >
      {banks?.length === 0 && (
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
              <span className="text-[16px] font-[500]">Domestic</span>
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
                  disabled={filteredDefaultPayout?.id === bank?.id}
                  className={
                    filteredDefaultPayout?.id === bank?.id
                      ? "flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-[6px] border border-white/70 bg-transparent px-2 text-white"
                      : "flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-passes-primary-color bg-passes-primary-color px-2 text-white"
                  }
                  onClick={() =>
                    setDefaultPayout({
                      bankId: bank.id,
                      method: PayoutMethodDtoMethodEnum.CircleWire
                    })
                  }
                >
                  <span className="text-[16px] font-[500]">
                    {filteredDefaultPayout?.id === bank?.id
                      ? "Bank Default"
                      : "Set Default"}
                  </span>
                </button>

                <button
                  className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 text-white"
                  onClick={() => deleteBank(bank?.id ?? "")}
                >
                  <BankIcon width={25} height={25} />
                  <span className="text-[16px] font-[500]">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Tab>
  )
}

export default ManageBank
