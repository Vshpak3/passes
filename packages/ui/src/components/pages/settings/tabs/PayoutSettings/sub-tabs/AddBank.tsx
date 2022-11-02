import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import InfoIcon from "public/icons/info-icon.svg"
import { memo, useState } from "react"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"

import { FormInput } from "src/components/atoms/FormInput"
import { EIcon } from "src/components/atoms/Input"
import { Select } from "src/components/atoms/Select"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { COUNTRIES, US_STATES } from "src/helpers/countries"
import { errorMessage } from "src/helpers/error"

enum BankTypeEnum {
  US = "us",
  IBAN = "iban",
  NON_IBAN = "non iban"
}

// TODO: update with actual values
interface BankForm {
  [key: string]: string
}

const AddBank = () => {
  const BANK_COUNTRY_FIELD = "bank-country"

  const idempotencyKey = v4()

  const { addOrPopStackHandler } = useSettings() as SettingsContextProps
  const [bankType, setBankType] = useState<BankTypeEnum>(BankTypeEnum.US)
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BankForm>({
    defaultValues: { country: COUNTRIES[0], BANK_COUNTRY_FIELD: COUNTRIES[0] }
  })
  const countrySelected = watch("country")

  const onSubmit = async () => {
    try {
      const values = getValues()
      const payload: CircleCreateBankRequestDto = {
        idempotencyKey: idempotencyKey,
        accountNumber:
          bankType === BankTypeEnum.US || bankType === BankTypeEnum.NON_IBAN
            ? values["account-number"]
            : undefined,
        routingNumber:
          bankType === BankTypeEnum.US || bankType === BankTypeEnum.NON_IBAN
            ? values["routing-number"]
            : undefined,
        iban: bankType === BankTypeEnum.IBAN ? values["iban"] : undefined,
        billingDetails: {
          name: values["name"],
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
          country: iso3311a2.getCode(values[BANK_COUNTRY_FIELD])
        }
      }

      const paymentApi = new PaymentApi()
      await paymentApi.createCircleBank({ circleCreateBankRequestDto: payload })
      addOrPopStackHandler(SubTabsEnum.PayoutSettings)
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  return (
    <Tab title="Add Bank" withBack>
      <div className="mt-4 flex flex-col">
        <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
          Type of Bank Account
        </span>
        <Select
          register={register}
          defaultValue={bankType}
          selectOptions={[
            { label: "US Bank", value: BankTypeEnum.US },
            { label: "International Bank - IBAN", value: BankTypeEnum.IBAN },
            {
              label: "International Bank - No IBAN",
              value: BankTypeEnum.NON_IBAN
            }
          ]}
          onChange={(newValue: BankTypeEnum) => {
            setBankType(newValue)
            setValue(BANK_COUNTRY_FIELD, newValue)
          }}
          name="bank-country"
          errors={errors}
        />
      </div>
      {bankType === BankTypeEnum.US || bankType === BankTypeEnum.NON_IBAN ? (
        <>
          <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
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
          />

          <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
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
          />
        </>
      ) : (
        <>
          <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
            IBAN
          </span>
          <FormInput
            register={register}
            type="text"
            name="iban"
            placeholder="IBAN"
            errors={errors}
            options={{
              required: { message: "IBAN is required", value: true }
            }}
          />
        </>
      )}
      <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
        Bank Info
      </span>
      <FormInput
        register={register}
        type="text"
        name="bank-name"
        placeholder="Bank Name"
        errors={errors}
      />
      <FormInput
        register={register}
        type="text"
        name="bank-city"
        placeholder="Bank City"
        errors={errors}
        className="mt-4"
      />
      <Select
        register={register}
        selectOptions={COUNTRIES}
        name="bank-country"
        errors={errors}
        className="mt-4"
        options={{
          required: { message: "Country is required", value: true }
        }}
        onChange={(newValue: string) => setValue("bank-country", newValue)}
      />

      <div className="mt-4">
        <span className="text-[16px] font-[500]">Billing address</span>
        <FormInput
          register={register}
          type="text"
          name="name"
          placeholder="Name"
          errors={errors}
          options={{
            required: { message: "Name is required", value: true }
          }}
          className="mt-4"
        />
        <FormInput
          register={register}
          type="text"
          name="address1"
          placeholder="Address 1"
          errors={errors}
          options={{
            required: { message: "Address is required", value: true }
          }}
          className="mt-4"
        />
        <FormInput
          register={register}
          type="text"
          name="address2"
          placeholder="Address 2"
          errors={errors}
          className="mt-4"
        />
        <Select
          register={register}
          selectOptions={COUNTRIES}
          name="country"
          errors={errors}
          placeholder="Country"
          className="mt-4"
          options={{
            required: { message: "Country is required", value: true }
          }}
          onChange={(newValue: string) => setValue("country", newValue)}
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
          className="mt-4"
        />
        <div className="flex gap-4">
          {countrySelected === COUNTRIES[0] ? (
            <Select
              register={register}
              selectOptions={US_STATES}
              errors={errors}
              placeholder="State"
              options={{
                required: { message: "State is required", value: true }
              }}
              name="district"
              className="mt-4"
              onChange={(newValue: string) => setValue("district", newValue)}
              showOnTop
            />
          ) : (
            <FormInput
              register={register}
              type="text"
              name="district"
              placeholder="State/District"
              iconAlign={EIcon.Right}
              icon={
                <div
                  className="tooltip absolute right-[15px] top-6 h-4 w-4"
                  data-tip="2 letter input only (Example: “FL”)"
                >
                  <InfoIcon />
                </div>
              }
              errors={errors}
              className="mt-4"
              options={{
                required: { message: "State is required", value: true }
              }}
            />
          )}
          <FormInput
            register={register}
            type="text"
            name="postal-code"
            placeholder="Zip"
            errors={errors}
            options={{
              required: { message: "Postal Code is required", value: true }
            }}
            className="mt-4"
          />
        </div>
      </div>
      <button
        className="mt-4 mb-8 flex h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-full border border-passes-pink-100 bg-passes-pink-100 px-2 text-white"
        onClick={handleSubmit(onSubmit)}
      >
        <span className="text-[16px] font-[500]">Confirm and Continue</span>
      </button>
    </Tab>
  )
}

export default memo(AddBank) // eslint-disable-line import/no-default-export
