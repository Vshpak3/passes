import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import InfoIcon from "public/icons/info-icon.svg"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms/FormInput"
import { EIcon } from "src/components/atoms/Input"
import { Select } from "src/components/atoms/Select"
import { ConditionRendering } from "src/components/molecules/ConditionRendering"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/settings"
import { COUNTRIES, US_STATES } from "src/helpers/countries"
import { errorMessage } from "src/helpers/error"
import { v4 } from "uuid"

enum BankTypeEnum {
  US = "us",
  IBAN = "iban",
  NON_IBAN = "non iban"
}

const AddBank = () => {
  const idempotencyKey = v4()

  const { addOrPopStackHandler } = useSettings() as SettingsContextProps
  const [bankType, setBankType] = useState<BankTypeEnum>(BankTypeEnum.US)
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors, isSubmitSuccessful }
  } = useForm<{ "bank-country": string; country: string }>({
    defaultValues: {}
  })
  const countrySelected = watch("country")
  const onSubmitHandler = () => !isSubmitSuccessful && handleSubmit(onSubmit)

  const onSubmit = async () => {
    try {
      const values: any = getValues()
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
          country: iso3311a2.getCode(values["bank-country"])
        }
      }

      const paymentApi = new PaymentApi()
      await paymentApi.createCircleBank({ circleCreateBankRequestDto: payload })
      addOrPopStackHandler(SubTabsEnum.PayoutSettings)
    } catch (error: any) {
      errorMessage(error, true)
    }
  }

  return (
    <Tab title="Add Bank" withBack>
      <div className="mt-4 flex flex-col">
        <span className="text-[16px] font-[500] text-[#767676]">
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
          onChange={(event: any) => {
            setBankType(event.target.value as BankTypeEnum)
            setValue("bank-country", event.target.value)
          }}
          name="bank-country"
          errors={errors}
          className="mt-4 mb-4 border-passes-dark-100 bg-transparent"
        />
      </div>
      <ConditionRendering
        condition={
          bankType === BankTypeEnum.US || bankType === BankTypeEnum.NON_IBAN
        }
      >
        <span className="text-[16px] font-[500] text-[#767676]">
          Routing Number
        </span>
        <FormInput
          register={register}
          type="text"
          name="routing-number"
          placeholder="4444 1902 0192 0100"
          errors={errors}
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
          className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
        />
      </ConditionRendering>
      <ConditionRendering condition={bankType === BankTypeEnum.IBAN}>
        <span className="text-[16px] font-[500] text-[#767676]">Iban</span>
        <FormInput
          register={register}
          type="text"
          name="iban"
          placeholder="IBAN"
          errors={errors}
          className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
        />
      </ConditionRendering>
      <span className="text-[16px] font-[500]">Bank Info</span>
      <FormInput
        register={register}
        type="text"
        name="bank-name"
        placeholder="Bank Name"
        options={{
          required: { message: "need a a bank name", value: true }
        }}
        errors={errors}
        className="mt-4 border-passes-dark-100 bg-transparent"
      />
      <FormInput
        register={register}
        type="text"
        name="bank-city"
        placeholder="Bank City"
        options={{
          required: { message: "need a bank city", value: true }
        }}
        errors={errors}
        className="mt-4 border-passes-dark-100 bg-transparent"
      />
      <FormInput
        register={register}
        type="select"
        selectOptions={COUNTRIES}
        name="bank-country"
        errors={errors}
        className="mt-4 border-passes-dark-100 bg-transparent"
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
            required: { message: "name is required", value: true }
          }}
          className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
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
              className="mt-3 w-[120px]"
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
              className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
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
            className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
          />
        </div>
      </div>
      <button
        className="mb-8 flex h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-full border border-passes-pink-100 bg-passes-pink-100 px-2 text-white"
        onClick={onSubmitHandler}
      >
        <span className="text-[16px] font-[500]">Confirm and Continue</span>
      </button>
    </Tab>
  )
}

export default AddBank // eslint-disable-line import/no-default-export
