import { yupResolver } from "@hookform/resolvers/yup"
import { PayoutMethodDto } from "@passes/api-client"
import React, { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { Button, FormInput } from "src/components/atoms"
import { bankingSchema, walletSchema } from "src/helpers/validation"

import Modal from "./Modal"

export enum EPayout {
  WALLET = "WALLET",
  BANK = "BANK"
}

interface IAddPayoutModal {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  defaultPayout: PayoutMethodDto | undefined
  payoutType: EPayout
}

const AddPayoutModal = ({
  isOpen = false,
  setOpen,
  payoutType
}: // defaultPayout
IAddPayoutModal) => {
  const {
    register: registerBanking,
    handleSubmit: handleBankingSubmit,
    formState: { errors: errorsBanking }
  } = useForm({
    resolver: yupResolver(bankingSchema)
  })

  const {
    register: registerWallet,
    handleSubmit: handleWalletSubmit,
    formState: { errors: errorsWallet }
  } = useForm({
    resolver: yupResolver(walletSchema)
  })

  async function onSubmit() {
    console.log("submit")
  }
  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      {payoutType === EPayout.BANK ? (
        <form
          onSubmit={(e) => {
            handleBankingSubmit(onSubmit)(e).catch((err) =>
              console.log(`errors: ${err}`)
            )
          }}
        >
          <div className="mb-3">
            <span className="text-[#ffff]/70">Banking information</span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-[#ffff]/90">
              To download W9 form
            </span>
            <Button variant="white">Download W9 Form</Button>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-[#ffff]/90">
              To edit W9 form
            </span>
            <Button variant="white">Edit W9 Form</Button>
          </div>
          <div className="flex flex-col gap-4">
            <hr className="border-[#ffff]/70" />
            <div>
              <span className="font-semibold text-[#ffff]/90">
                Your Bank account Data
              </span>
            </div>
            <div>
              <span className="text-[#ffff]/70">Routing Number</span>
              <FormInput
                errors={errorsBanking}
                register={registerBanking}
                type="text"
                name="routingNumber"
                placeholder="Routing Number"
                className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div>
              <span className="text-[#ffff]/70">Account Number</span>
              <FormInput
                errors={errorsBanking}
                register={registerBanking}
                type="text"
                name="accountNumber"
                placeholder=" - "
                className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div>
              <span className="text-[#ffff]/70">Type of Bank Account</span>
              <FormInput
                errors={errorsBanking}
                register={registerBanking}
                type="text"
                name="accountType"
                placeholder="Choose"
                className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div>
              <span className="semibold text-[#ffff]/90">Billing address</span>
              <FormInput
                errors={errorsBanking}
                register={registerBanking}
                type="text"
                name="billingAddress"
                placeholder="Address 1"
                className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div>
              <FormInput
                errors={errorsBanking}
                register={registerBanking}
                type="text"
                name="alternativeAddress"
                placeholder="Address 2"
                className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div>
              <FormInput
                errors={errorsBanking}
                register={registerBanking}
                type="text"
                name="city"
                placeholder="City"
                className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div className="flex justify-between gap-4">
              <FormInput
                errors={errorsBanking}
                register={registerBanking}
                type="text"
                name="district"
                placeholder="State/District"
                className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
              <FormInput
                errors={errorsBanking}
                register={registerBanking}
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div>
              <span className="semibold text-[#ffff]/90">
                Send email recipients to
              </span>
              <FormInput
                errors={errorsBanking}
                register={registerBanking}
                type="text"
                name="email"
                placeholder="Email address"
                className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div>
              <Button variant="pink" className="text-[#ffff]">
                Confirm
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            handleWalletSubmit(onSubmit)(e).catch((err) =>
              console.log(`errors: ${err}`)
            )
          }}
        >
          <div className="mb-3">
            <span className="text-[#ffff]/70">Wallet information</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[#ffff]/70">Wallet Address</span>
              <FormInput
                errors={errorsWallet}
                register={registerWallet}
                type="text"
                name="walletAddress"
                placeholder=""
                className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div>
              <span className="text-[#ffff]/70">Chain</span>
              <FormInput
                errors={errorsWallet}
                register={registerWallet}
                type="text"
                name="chain"
                placeholder=""
                className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
              />
            </div>
            <div>
              <Button variant="pink" className="text-[#ffff]">
                Confirm
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  )
}
export default AddPayoutModal
