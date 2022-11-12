import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import InfoIcon from "public/icons/info-icon.svg"
import { memo, useState } from "react"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"

import { EIcon, Input } from "src/components/atoms/input/GeneralInput"
import { Select } from "src/components/atoms/input/Select"
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
    setValue,
    watch,
    formState: { errors }
  } = useForm<BankForm>({
    defaultValues: { country: COUNTRIES[0], BANK_COUNTRY_FIELD: COUNTRIES[0] }
  })
  const countrySelected = watch("country")

  const onSubmit = async (values: BankForm) => {
    try {
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
          defaultValue={bankType}
          errors={errors}
          name="bank-country"
          onChange={(newValue: BankTypeEnum) => {
            setBankType(newValue)
            setValue(BANK_COUNTRY_FIELD, newValue)
          }}
          register={register}
          selectOptions={[
            { label: "US Bank", value: BankTypeEnum.US },
            { label: "International Bank - IBAN", value: BankTypeEnum.IBAN },
            {
              label: "International Bank - No IBAN",
              value: BankTypeEnum.NON_IBAN
            }
          ]}
        />
      </div>
      {bankType === BankTypeEnum.US || bankType === BankTypeEnum.NON_IBAN ? (
        <>
          <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
            Routing Number
          </span>
          <Input
            errors={errors}
            name="routing-number"
            options={{
              required: { message: "Routing number is required", value: true }
            }}
            placeholder="4444 1902 0192 0100"
            register={register}
            type="text"
          />

          <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
            Account Number
          </span>
          <Input
            errors={errors}
            name="account-number"
            options={{
              required: { message: "Account number is required", value: true }
            }}
            placeholder="-"
            register={register}
            type="text"
          />
        </>
      ) : (
        <>
          <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
            IBAN
          </span>
          <Input
            errors={errors}
            name="iban"
            options={{
              required: { message: "IBAN is required", value: true }
            }}
            placeholder="IBAN"
            register={register}
            type="text"
          />
        </>
      )}
      <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
        Bank Info
      </span>
      <Input
        errors={errors}
        name="bank-name"
        placeholder="Bank Name"
        register={register}
        type="text"
      />
      <Input
        className="mt-4"
        errors={errors}
        name="bank-city"
        placeholder="Bank City"
        register={register}
        type="text"
      />
      <Select
        className="mt-4"
        errors={errors}
        name="bank-country"
        onChange={(newValue: string) => setValue("bank-country", newValue)}
        options={{
          required: { message: "Country is required", value: true }
        }}
        register={register}
        selectOptions={COUNTRIES}
      />

      <div className="mt-4">
        <span className="text-[16px] font-[500]">Billing address</span>
        <Input
          className="mt-4"
          errors={errors}
          name="name"
          options={{
            required: { message: "Name is required", value: true }
          }}
          placeholder="Name"
          register={register}
          type="text"
        />
        <Input
          className="mt-4"
          errors={errors}
          name="address1"
          options={{
            required: { message: "Address is required", value: true }
          }}
          placeholder="Address 1"
          register={register}
          type="text"
        />
        <Input
          className="mt-4"
          errors={errors}
          name="address2"
          placeholder="Address 2"
          register={register}
          type="text"
        />
        <Select
          className="mt-4"
          errors={errors}
          name="country"
          onChange={(newValue: string) => setValue("country", newValue)}
          options={{
            required: { message: "Country is required", value: true }
          }}
          placeholder="Country"
          register={register}
          selectOptions={COUNTRIES}
        />
        <Input
          className="mt-4"
          errors={errors}
          name="city"
          options={{
            required: { message: "City is required", value: true }
          }}
          placeholder="City"
          register={register}
          type="text"
        />
        <div className="flex gap-4">
          {countrySelected === COUNTRIES[0] ? (
            <Select
              className="mt-4"
              errors={errors}
              name="district"
              onChange={(newValue: string) => setValue("district", newValue)}
              options={{
                required: { message: "State is required", value: true }
              }}
              placeholder="State"
              register={register}
              selectOptions={US_STATES}
              showOnTop
            />
          ) : (
            <Input
              className="mt-4"
              errors={errors}
              icon={
                <div
                  className="absolute right-[15px] top-6 h-4 w-4"
                  data-tip="2 letter input only (Example: “FL”)"
                >
                  <InfoIcon />
                </div>
              }
              iconAlign={EIcon.Right}
              name="district"
              options={{
                required: { message: "State is required", value: true }
              }}
              placeholder="State/District"
              register={register}
              type="text"
            />
          )}
          <Input
            className="mt-4"
            errors={errors}
            name="postal-code"
            options={{
              required: { message: "Postal Code is required", value: true }
            }}
            placeholder="Zip"
            register={register}
            type="text"
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
