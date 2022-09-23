import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import { toInteger } from "lodash"
import { useRouter } from "next/router"
import EditIcon from "public/icons/edit.svg"
import InfoIcon from "public/icons/info-icon.svg"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput } from "src/components/atoms"
import { v4 } from "uuid"

import { SubTabsEnum } from "../../../../../../config/settings"
import {
  ISettingsContext,
  useSettings
} from "../../../../../../contexts/settings"
import { COUNTRIES } from "../../../../../../helpers/countries"
import { useUser } from "../../../../../../hooks"
import Tab from "../../../Tab"

enum BankTypeEnum {
  US,
  IBAN,
  NON_IBAN
}

const bankTypeOptions = [
  {
    label: "US",
    value: BankTypeEnum.US
  },
  {
    label: "IBAN",
    value: BankTypeEnum.IBAN
  },
  {
    label: "NON_IBAN",
    value: BankTypeEnum.NON_IBAN
  }
]

const AddBank = () => {
  const idempotencyKey = v4()
  const { addTabToStackHandler } = useSettings() as ISettingsContext

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {}
  })

  const { user, loading } = useUser()
  const router = useRouter()

  const onSubmit = async () => {
    try {
      const values: any = getValues()
      const payload: CircleCreateBankRequestDto = {
        idempotencyKey: idempotencyKey,
        accountNumber:
          toInteger(values["bankAccountType"]) === BankTypeEnum.US ||
          toInteger(values["bankAccountType"]) == BankTypeEnum.NON_IBAN
            ? values["account-number"]
            : undefined,
        routingNumber:
          toInteger(values["bankAccountType"]) === BankTypeEnum.US ||
          toInteger(values["bankAccountType"]) == BankTypeEnum.NON_IBAN
            ? values["routing-number"]
            : undefined,
        iban:
          toInteger(values["bankAccountType"]) === BankTypeEnum.IBAN
            ? values["iban"]
            : undefined,
        billingDetails: {
          name: user?.legalFullName ?? "",
          city: values["city"],
          country: iso3311a2.getCode(values["country"]),
          line1: values["address1"],
          line2: values["address2"],
          district: values["district"],
          postalCode: values["postal-code"]
        },
        bankAddress: {
          bankName: values["bank-name"],
          city: values["bank-city"],
          country: iso3311a2.getCode(values["country"])
        }
      }

      const paymentApi = new PaymentApi()
      await paymentApi.createCircleBank({ circleCreateBankRequestDto: payload })
    } catch (error: any) {
      toast.error(error)
    } finally {
      addTabToStackHandler(SubTabsEnum.ManageBank)
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
    <Tab title="Add Bank" withBack>
      <span className="text-[16px] font-[500] opacity-50">
        Banking information
      </span>
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-[500]">To download W9 form</span>
        <button
          className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 text-white"
          onClick={() => console.log}
        >
          <span className="text-[16px] font-[500]">Download W9 Form</span>
        </button>
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
        <button
          className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 text-white"
          onClick={() => console.log}
        >
          <EditIcon />
          <span className="text-[16px] font-[500]">Edit W9 Form</span>
        </button>
      </div>
      <span className="text-[16px] font-[500] text-[#767676]">
        Type of Bank Account
      </span>
      <FormInput
        register={register}
        type="select"
        selectOptions={bankTypeOptions}
        name="bankAccountType"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
      />
      <span className="text-[16px] font-[500] text-[#767676]">
        Routing Number
      </span>
      <FormInput
        register={register}
        type="text"
        name="routing-number"
        placeholder="4444 1902 0192 0100"
        errors={errors}
        options={{
          required: { message: "Routing number is required", value: true }
        }}
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
      />
      <span className="text-[16px] font-[500] text-[#767676]">
        Account Number
      </span>
      <FormInput
        register={register}
        type="text"
        name="account-number"
        placeholder="-"
        errors={errors}
        options={{
          required: { message: "Account number is required", value: true }
        }}
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
      />
      <span className="text-[16px] font-[500]">Billing address</span>
      <FormInput
        register={register}
        type="text"
        name="address1"
        placeholder="Address 1"
        errors={errors}
        options={{
          required: { message: "Address is required", value: true }
        }}
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
      />
      <FormInput
        register={register}
        type="text"
        name="address2"
        placeholder="Address 2"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
      />
      <FormInput
        register={register}
        type="select"
        selectOptions={COUNTRIES}
        name="country"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
      />
      <FormInput
        register={register}
        type="text"
        name="city"
        placeholder="City"
        errors={errors}
        options={{
          required: { message: "City is required", value: true }
        }}
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
      />
      <div className="flex gap-4">
        <FormInput
          register={register}
          type="text"
          name="district"
          placeholder="State/District"
          icon={
            <div
              className="tooltip absolute left-[160px] top-[26px] h-4 w-4"
              data-tip="2 letter input only (Example: “FL”)"
            >
              <InfoIcon />
            </div>
          }
          errors={errors}
          className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
        />

        <FormInput
          register={register}
          type="text"
          name="postal-code"
          placeholder="Zip"
          errors={errors}
          options={{
            required: { message: "Postal Code is required", value: true }
          }}
          className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
        />
      </div>
      <button
        className="mb-8 flex h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-full border border-passes-pink-100 bg-passes-pink-100 px-2 text-white"
        onClick={handleSubmit(onSubmit)}
      >
        <span className="text-[16px] font-[500]">Confirm and Continue</span>
      </button>
    </Tab>
  )
}

export default AddBank
