import { yupResolver } from "@hookform/resolvers/yup"
import { PayoutMethodDto, WalletApi } from "@passes/api-client"
import { useRouter } from "next/router"
import React, { Dispatch, SetStateAction, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  ButtonTypeEnum,
  FormInput,
  PassesPinkButton
} from "src/components/atoms"
import { wrapApi } from "src/helpers"
import { walletSchema } from "src/helpers/validation"
import { useUser } from "src/hooks"

import Modal from "./Modal"

interface IAddPayoutModal {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  defaultPayout: PayoutMethodDto | undefined
}

const AddPayoutModal = ({
  isOpen = false,
  setOpen
}: // defaultPayout
IAddPayoutModal) => {
  const { user, loading } = useUser()
  const router = useRouter()

  const {
    register: register,
    handleSubmit: handleSubmit,
    getValues: getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(walletSchema)
  })

  async function onSubmit() {
    const walletApi = wrapApi(WalletApi)
    try {
      const walletValues: any = getValues()
      await walletApi.walletCreateUnauthenticated({
        createUnauthenticatedWalletRequestDto: {
          walletAddress: walletValues["walletAddress"],
          chain: walletValues["chain"]
        }
      })
      router.push("/payment/default-payout-method")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!router.isReady || loading) {
      return
    }

    if (!user) {
      router.push("/login")
    }
  }, [router, user, loading])

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e).catch((err) =>
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
              errors={errors}
              register={register}
              type="text"
              name="walletAddress"
              placeholder=""
              className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
          </div>
          <div>
            <span className="text-[#ffff]/70">Chain</span>

            <FormInput
              register={register}
              type="select"
              name="chain"
              selectOptions={["eth", "sol", "matic", "avax"]}
              errors={errors}
              className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-[#BF7AF0] focus:ring-0"
            />
          </div>
          <div>
            <PassesPinkButton
              name="Confirm and Continue"
              type={ButtonTypeEnum.SUBMIT}
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
export default AddPayoutModal
