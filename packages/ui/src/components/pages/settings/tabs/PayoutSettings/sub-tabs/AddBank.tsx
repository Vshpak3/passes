import { yupResolver } from "@hookform/resolvers/yup"
import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import InfoIcon from "public/icons/info-icon.svg"
import { memo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { v4 } from "uuid"
import { object, string } from "yup"

import { Button } from "src/components/atoms/button/Button"
import { CustomSelect } from "src/components/atoms/input/CustomSelect"
import { EIcon, Input } from "src/components/atoms/input/GeneralInput"
import { Tab } from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { CANADA_DISTRICTS, COUNTRIES, US_STATES } from "src/helpers/countries"
import { errorMessage } from "src/helpers/error"
import { sleep } from "src/helpers/sleep"

enum BankTypeEnum {
  US = "us",
  IBAN = "iban",
  NON_IBAN = "non iban"
}

interface BankForm {
  "account-number": string
  "routing-number": string
  iban: string
  name: string
  city: string
  country: string
  address1: string
  address2: string
  district: string
  "postal-code": string
  "bank-name": string
  "bank-city": string

  "bank-country": string
  "bank-type": string
}

const bankForm = object().shape({
  "account-number": string().when("bank-type", {
    is: (type: BankTypeEnum) =>
      type === BankTypeEnum.US || type === BankTypeEnum.NON_IBAN,
    then: string().required("Account Number is required")
  }),
  "routing-number": string().when("bank-type", {
    is: (type: BankTypeEnum) =>
      type === BankTypeEnum.US || type === BankTypeEnum.NON_IBAN,
    then: string().required("Routing Number is required")
  }),
  iban: string().when("bank-type", {
    is: (type: BankTypeEnum) => type === BankTypeEnum.IBAN,
    then: string().required("IBAN is required")
  }),
  name: string().required("Name is required"),
  city: string().required("City is required"),
  country: string().required(),
  address1: string().required("Address is required"),
  address2: string(),
  district: string().required(),
  "postal-code": string()
    .required("Postal code is required")
    .matches(/^\d{5}$/, "Post code must be a 5 digit number"),
  "bank-name": string().required(),
  "bank-city": string().required(),
  "bank-country": string().required("Country is required")
})

const AddBank = () => {
  const idempotencyKey = v4()

  const { addOrPopStackHandler } = useSettings() as SettingsContextProps
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors, isSubmitting }
  } = useForm<BankForm>({
    defaultValues: {
      country: COUNTRIES[0],
      "bank-country": COUNTRIES[0],
      "bank-type": BankTypeEnum.US
    },
    resolver: yupResolver(bankForm)
  })
  const countrySelected = watch("country")
  const bankType = watch("bank-type")

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
          country: iso3311a2.getCode(values["bank-country"])
        }
      }

      const paymentApi = new PaymentApi()
      await paymentApi.createCircleBank({ circleCreateBankRequestDto: payload })
      toast.success("Bank added succesfully")
      await sleep("3 second") // waiting for circle
      addOrPopStackHandler(SubTabsEnum.PayoutSettings)
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }

  return (
    <Tab defaultSubTab={SubTabsEnum.PayoutSettings} title="Add Bank">
      <div className="mt-4 flex flex-col">
        <span className="mt-3 mb-2 block text-[16px] font-[500] text-white">
          Type of Bank Account
        </span>
        <CustomSelect
          control={control}
          defaultValue="US Bank"
          errors={errors}
          name="bank-type"
          placeholder="Bank Type"
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
      <CustomSelect
        className="mt-4"
        control={control}
        errors={errors}
        name="bank-country"
        options={{
          required: { message: "Country is required", value: true }
        }}
        placeholder="Bank Country"
        selectOptions={COUNTRIES}
      />

      <div className="mt-4">
        <span className="text-[16px] font-[500]">Billing address</span>
        <Input
          className="mt-4"
          errors={errors}
          name="name"
          placeholder="Name"
          register={register}
          type="text"
        />
        <Input
          className="mt-4"
          errors={errors}
          name="address1"
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
        <CustomSelect
          className="mt-4"
          control={control}
          errors={errors}
          name="country"
          placeholder="Country"
          selectOptions={COUNTRIES}
        />
        <Input
          className="mt-4"
          errors={errors}
          name="city"
          placeholder="City"
          register={register}
          type="text"
        />
        <div className="flex gap-4">
          {countrySelected === COUNTRIES[0] ||
          countrySelected === COUNTRIES[1] ? (
            <CustomSelect
              className="mt-4"
              control={control}
              errors={errors}
              name="district"
              placeholder="State"
              selectOptions={
                countrySelected === COUNTRIES[0] ? US_STATES : CANADA_DISTRICTS
              }
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
              placeholder="State/District"
              register={register}
              type="text"
            />
          )}
          <Input
            className="mt-4"
            errors={errors}
            name="postal-code"
            placeholder="Zip"
            register={register}
            type="text"
          />
        </div>
      </div>
      <Button
        className="mt-4 mb-8 w-full"
        disabled={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        <span className="text-[16px] font-[500]">Confirm and Continue</span>
      </Button>
    </Tab>
  )
}

export default memo(AddBank) // eslint-disable-line import/no-default-export
