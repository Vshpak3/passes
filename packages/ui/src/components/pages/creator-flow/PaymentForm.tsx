import { yupResolver } from "@hookform/resolvers/yup"
import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
import CheckCircleFilled from "public/icons/check-circle-green.svg"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { v4 } from "uuid"
import { object, string } from "yup"

import {
  Button,
  ButtonTypeEnum,
  ButtonVariant
} from "src/components/atoms/button/Button"
import { DownloadW9FormButton } from "src/components/atoms/DownloadW9FormButton"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Input } from "src/components/atoms/input/GeneralInput"
import { SelectInput } from "src/components/atoms/input/SelectInput"
import { UploadW9FormButton } from "src/components/atoms/UploadW9FormButton"
import { errorMessage } from "src/helpers/error"

type PaymentFormProps = {
  onFinishPaymentForm: (isSubmittedBankDetails?: boolean) => void
}

enum BankTypeEnum {
  US,
  IBAN,
  NON_IBAN
}

interface PaymentFormFields {
  bankAddress: { country: string }
  bankAccountType: BankTypeEnum
  accountNumber: string
  routingNumber: string
  iban: string
  firstName: string
  lastName: string
  city: string
  billingAddress: string
  alternativeAddress: string
  district: string
  postalCode: string
}

const paymentForm = object().shape(
  {
    bankAddress: object().shape({
      country: string().required("country is required")
    }),
    bankAccountType: string().required("Bank Account Type is required"),
    accountNumber: string().required("Account Number is required"),
    routingNumber: string().when("iban", {
      is: (iban: string) => !iban || iban.length === 0,
      then: string().required("Routing Number is required")
    }),
    iban: string().when("routingNumber", {
      is: (routingNumber: string) =>
        !routingNumber || routingNumber.length === 0,
      then: string().required("IBAN is required")
    }),
    firstName: string().required("First Name is required"),
    lastName: string().required("Last Name is required"),
    city: string().required("City is required"),
    billingAddress: string().required("Billing address is required"),
    alternativeAddress: string().required("Alternative address is required"),
    district: string().required("State is required"),
    postalCode: string()
      .required("Postal code is required")
      .matches(/^\d{5}$/, "Post code must be a 5 digit number"),
    emailRecipient: string()
      .email("Email is invalid")
      .required("Recipient email is required"),
    email: string().email("Email is invalid").required("Email is required")
  },
  [["routingNumber", "iban"]]
)

export const PaymentForm: FC<PaymentFormProps> = ({ onFinishPaymentForm }) => {
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bankType, setBankType] = useState<BankTypeEnum>(BankTypeEnum.US)
  const idempotencyKey = v4()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful }
  } = useForm<PaymentFormFields>({
    resolver: yupResolver(paymentForm)
  })

  const onSubmit = async (values: PaymentFormFields) => {
    try {
      const payload: CircleCreateBankRequestDto = {
        idempotencyKey: idempotencyKey,
        accountNumber:
          bankType === BankTypeEnum.US || bankType === BankTypeEnum.NON_IBAN
            ? values["accountNumber"]
            : undefined,
        routingNumber:
          bankType === BankTypeEnum.US || bankType === BankTypeEnum.NON_IBAN
            ? values["routingNumber"]
            : undefined,
        iban: bankType === BankTypeEnum.IBAN ? values["iban"] : undefined,
        billingDetails: {
          name: `${values.firstName} ${values.lastName}`,
          city: values["city"],
          country: values["bankAddress"]["country"],
          line1: values["billingAddress"],
          line2: values["alternativeAddress"],
          district: values["district"],
          postalCode: values["postalCode"]
        },
        bankAddress: {
          country: values["bankAddress"]["country"]
        }
      }

      const paymentApi = new PaymentApi()
      await paymentApi.createCircleBank({ circleCreateBankRequestDto: payload })
      onFinishPaymentForm()
    } catch (error: unknown) {
      errorMessage(error, true)
    }
  }
  return (
    <div className="flex justify-center pb-20 text-white">
      <div className="flex w-4/5 max-w-[1110px] flex-col justify-between gap-6 sm:-mt-12 sm:flex-row">
        <div className="flex-[33]">
          <div className="flex w-full flex-col gap-[10px] rounded-3xl px-4 py-10 sm:border sm:border-gray-700 sm:bg-[#12070E80] sm:px-8 sm:backdrop-blur-3xl">
            <div className="flex flex-row items-center gap-2">
              <CheckCircleFilled />
              Your account has been approved
            </div>
            <div className="font-bold">
              Provide your W9 form for tax and payout purposes to get paid.
            </div>
            <div className="text-[#b3bee7] opacity-[0.75]">
              You will be able to edit it in the settings later.
            </div>
            <DownloadW9FormButton />
            <UploadW9FormButton icon={false} text="Upload W9 Form" />
          </div>
        </div>
        <form
          className="flex-[67]"
          onSubmit={(e) => {
            handleSubmit(onSubmit)(e).catch((err) => {
              toast.error(err)
              console.error(`errors: ${err}`)
            })
          }}
        >
          <div className="flex w-full flex-col gap-[12px] rounded-3xl px-4 py-8 sm:border sm:border-gray-700 sm:bg-[#12070E80] sm:px-5 sm:backdrop-blur-3xl">
            <div className="flex flex-col">
              <div className="text-lg font-bold">
                Bank Account Data for Payouts
              </div>
              <div className="text-xs font-medium leading-[22px] text-[#b3bee7] opacity-[0.75]">
                You will be able to edit it in the settings later.
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.75]">
                Routing Number
              </div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white"
                errors={errors}
                name="routingNumber"
                placeholder="123456789"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.75]">
                Account Number
              </div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white"
                errors={errors}
                name="accountNumber"
                placeholder="123456789"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.75]">
                Type of Bank Account
              </div>
              <SelectInput
                className="w-full border-[#34343ACC] bg-black text-white"
                control={control}
                errors={errors}
                name="bankAccountType"
                placeholder="Choose"
                selectOptions={[{ label: "US", value: "US" }]}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.75]">Country</div>
              <SelectInput
                className="w-full border-[#34343ACC] bg-black text-white"
                control={control}
                errors={errors.bankAddress?.country}
                name="bankAddress.country"
                placeholder="Choose Country"
                selectOptions={[{ label: "USA", value: "US" }]}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.75]">First Name</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white"
                errors={errors}
                name="firstName"
                placeholder="First Name"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.75]">Last Name</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white"
                errors={errors}
                name="lastName"
                placeholder="Last Name"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.75]">Business Name</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white"
                errors={errors}
                name="businessName"
                placeholder="Business (optional)"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.75]">Email</div>
              <Input
                autoComplete="email"
                className="w-full border-[#34343ACC] bg-black text-white"
                errors={errors}
                name="email"
                placeholder="Email Address"
                register={register}
                type="email"
              />
            </div>
            <div className="flex flex-col gap-[24px]">
              <div className="text-lg font-bold">Billing Address</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white"
                errors={errors}
                name="billingAddress"
                placeholder="Address 1"
                register={register}
                type="text"
              />
              <Input
                className="w-full border-[#34343ACC] bg-black text-white"
                errors={errors}
                name="alternativeAddress"
                placeholder="Address 2"
                register={register}
                type="text"
              />
              <Input
                className="w-full border-[#34343ACC] bg-black text-white"
                errors={errors}
                name="city"
                placeholder="City"
                register={register}
                type="text"
              />
              <div className="flex flex-row gap-3">
                <Input
                  className="w-full border-[#34343ACC] bg-black text-white"
                  errors={errors}
                  name="district"
                  placeholder="State"
                  register={register}
                  type="text"
                />
                <Input
                  className="w-full border-[#34343ACC] bg-black text-white"
                  errors={errors}
                  name="postalCode"
                  placeholder="Zip Code"
                  register={register}
                  type="text"
                />
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-11">
              {/* <div className="text-base font-bold">
                Or Use Your Crypto Wallet for Payouts
              </div>
              <div className="flex flex-row gap-5">
                <MetamaskIcon className="h-[34px] w-[34px]" />
                <CoinbaseIcon className="h-[34px] w-[34px]" />
                <TrelloIcon className="h-[34px] w-[34px]" />
                <PhantomIcon className="h-[34px] w-[34px]" />
                <WalletConnectIcon className="h-[34px] w-[34px]" />
              </div> */}
              <div>
                <div className="flex flex-col gap-[6px]">
                  <div className="text-base font-bold">
                    Send email receipts to
                  </div>
                  <Input
                    className="w-full border-[#34343ACC] bg-black text-white"
                    errors={errors}
                    name="emailRecipient"
                    placeholder=""
                    register={register}
                    type="text"
                  />
                  <div className="mt-2.5">
                    <label className="flex items-center">
                      <Checkbox
                        className="cursor-pointer rounded border-gray-300 bg-transparent bg-none text-[#9C4DC1]"
                        name="termsAndConditions"
                        register={register}
                        type="checkbox"
                      />
                      <span className="text-base">
                        By checking this box I agree to Passes{" "}
                        <a
                          className="text-passes-pink-100"
                          href="/terms"
                          target="_blank"
                        >
                          Terms and Conditions
                        </a>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Button
                className="font-normal"
                disabled={isSubmitSuccessful}
                type={ButtonTypeEnum.SUBMIT}
              >
                Confirm and Save
              </Button>
              <Button
                className="w-full bg-transparent"
                onClick={onFinishPaymentForm}
                variant={ButtonVariant.PRIMARY}
              >
                Skip for now
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
