import { yupResolver } from "@hookform/resolvers/yup"
import {
  CircleCreateBankRequestDto,
  PaymentApi,
  PayoutMethodDto
} from "@passes/api-client"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import {
  Button,
  ButtonTypeEnum,
  FormInput,
  PassesPinkButton
} from "src/components/atoms"
import { bankingSchema } from "src/helpers/validation"
import { useUser } from "src/hooks"
import { v4 } from "uuid"

import { wrapApi } from "../../helpers"
import Modal from "./Modal"

enum BankTypeEnum {
  US,
  IBAN,
  NON_IBAN
}

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
  const [bankType, setBankType] = useState<BankTypeEnum>(BankTypeEnum.US)
  const idempotencyKey = v4()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(bankingSchema)
  })

  const { user, loading } = useUser()
  const router = useRouter()

  const onSubmit = async () => {
    try {
      const values: any = getValues()

      const payload: CircleCreateBankRequestDto = {
        idempotencyKey: idempotencyKey,
        accountNumber:
          bankType === BankTypeEnum.US || bankType == BankTypeEnum.NON_IBAN
            ? values["accountNumber"]
            : undefined,
        routingNumber:
          bankType === BankTypeEnum.US || bankType == BankTypeEnum.NON_IBAN
            ? values["routingNumber"]
            : undefined,
        iban: bankType === BankTypeEnum.IBAN ? values["iban"] : undefined,
        billingDetails: {
          name: values["beneficiaryName"],
          city: values["city"],
          country: values["bankAddress"]["country"], // TODO: this needs to change support user country instead
          line1: values["billingAddress"],
          line2: values["alternativeAddress"],
          district: values["district"],
          postalCode: values["postalCode"]
        },
        bankAddress: {
          bankName: values["bankAddress"]["bankName"],
          city: values["bankAddress"]["city"],
          country: values["bankAddress"]["country"]
        }
      }

      const paymentApi = wrapApi(PaymentApi)
      //TODO: handle error on frontend (display some generic message)
      await paymentApi.createCircleBank({ circleCreateBankRequestDto: payload })
      router.push("/payment/default-payout-method")
    } catch (error: any) {
      toast.error(error)
      console.error(error)
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

  useEffect(() => {
    console.log("🚀 ~ file: AddBankingModal.tsx ~ line 105 ~ errors", errors)
  }, [errors])

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e).catch((err) => {
            toast.error(err)
            console.error(`errors: ${err}`)
          })
        }}
      >
        <button
          onClick={() => {
            setBankType(BankTypeEnum.US)
          }}
        >
          US (United States) Bank
        </button>
        <br />
        <button
          onClick={() => {
            setBankType(BankTypeEnum.IBAN)
          }}
        >
          Outside US Bank - IBAN
        </button>
        <br />
        <button
          onClick={() => {
            setBankType(BankTypeEnum.NON_IBAN)
          }}
        >
          Outside US Bank - no IBAN
        </button>
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
          <span className="font-semibold text-[#ffff]/90">To edit W9 form</span>
          <Button variant="white">Edit W9 Form</Button>
        </div>
        <div className="flex flex-col gap-4">
          <hr className="border-[#ffff]/70" />
          <div>
            <span className="font-semibold text-[#ffff]/90">
              Your Bank account Data
            </span>
          </div>
          {(bankType === BankTypeEnum.US ||
            bankType === BankTypeEnum.NON_IBAN) && (
            <>
              <div>
                <span className="text-[#ffff]/70">Routing Number</span>
                <FormInput
                  errors={errors}
                  register={register}
                  type="text"
                  name="routingNumber"
                  placeholder="Routing Number"
                  className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
                />
              </div>
              <div>
                <span className="text-[#ffff]/70">Account Number</span>
                <FormInput
                  errors={errors}
                  register={register}
                  type="text"
                  name="accountNumber"
                  placeholder=" - "
                  className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
                />
              </div>
            </>
          )}
          {bankType === BankTypeEnum.IBAN && (
            <FormInput
              register={register}
              type="text"
              name="iban"
              placeholder="IBAN Number"
              options={{
                required: { message: "need a month", value: true },
                pattern: {
                  message: "must be a month",
                  value: /^[A-Z]{2}[A-Z\d]*$/
                }
              }}
              errors={errors}
              className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          )}
          <div>
            <span className="text-[#ffff]/70">Type of Bank Account</span>
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="accountType"
              placeholder="Choose"
              className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          </div>
          <div>
            <span className="semibold text-[#ffff]/90">Billing address</span>
            <FormInput
              register={register}
              type="text"
              name="beneficiaryName"
              placeholder="Full Name"
              options={{
                required: { message: "need a name", value: true }
              }}
              errors={errors}
              className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          </div>
          <div>
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="billingAddress"
              placeholder="Address 1"
              className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          </div>
          <div>
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="alternativeAddress"
              placeholder="Address 2"
              className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          </div>
          <div>
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="city"
              placeholder="City"
              className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          </div>
          <div className="flex justify-between gap-4">
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="district"
              placeholder="State/District"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          </div>

          <div>
            <span className="text-[#ffff]/70">Bank Info:</span>
            <div>
              <FormInput
                register={register}
                type="text"
                name="bankAddress.bankName"
                placeholder="Bank Name"
                errors={errors}
                className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
              />
            </div>
            <div>
              <FormInput
                register={register}
                type="text"
                name="bankAddress.city"
                placeholder="Bank City"
                errors={errors}
                className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
              />
            </div>
            <div>
              <FormInput
                register={register}
                type="text"
                name="bankAddress.country"
                placeholder="Bank Country (2 letters)"
                errors={errors}
                className="mb-4 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
              />
            </div>
          </div>

          <div>
            <span className="semibold text-[#ffff]/90">
              Send email recipients to
            </span>
            <FormInput
              errors={errors}
              register={register}
              type="text"
              name="email"
              placeholder="Email address"
              className="m-0 mt-2 border-transparent bg-transparent text-[#ffff]/90 focus:border-passes-secondary-color focus:ring-0"
            />
          </div>
          <div>
            {/* <Button
              type={ButtonTypeEnum.SUBMIT}
              variant="pink"
              className="text-[#ffff]"
              {...(submitting ? { disabled: true } : {})}
            >
              Confirm
            </Button> */}
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
