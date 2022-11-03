import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
import CheckCircleFilled from "public/icons/check-circle-green.svg"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { v4 } from "uuid"

import {
  Button,
  ButtonTypeEnum,
  PassesPinkButton
} from "src/components/atoms/Button"
import { DownloadW9FormButton } from "src/components/atoms/DownloadW9FormButton"
import { Checkbox } from "src/components/atoms/input/Checkbox"
import { Input } from "src/components/atoms/input/GeneralInput"
import { Select } from "src/components/atoms/input/Select"
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

export const PaymentForm: FC<PaymentFormProps> = ({ onFinishPaymentForm }) => {
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bankType, setBankType] = useState<BankTypeEnum>(BankTypeEnum.US)
  const idempotencyKey = v4()

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitSuccessful }
  } = useForm<PaymentFormFields>()

  const onSubmit = async () => {
    try {
      const values = getValues()

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
          <div className="flex w-full flex-col gap-[10px] rounded-3xl px-4 py-10 sm:border sm:border-gray-700 sm:bg-[#1B141D80] sm:px-8 sm:backdrop-blur-3xl">
            <div className="flex flex-row items-center gap-2">
              <CheckCircleFilled />
              Your account has been approved
            </div>
            <div className="font-bold">
              Provide your W9 form for tax and payout purposes to get paid.
            </div>
            <div className="text-[#b3bee7] opacity-[0.6]">
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
          <div className="flex w-full flex-col gap-[12px] rounded-3xl px-4 py-8 sm:border sm:border-gray-700 sm:bg-[#1B141D80] sm:px-5 sm:backdrop-blur-3xl">
            <div className="flex flex-col">
              <div className="text-lg font-bold">
                Bank Account Data for Payouts
              </div>
              <div className="text-xs font-medium leading-[22px] text-[#b3bee7] opacity-[0.6]">
                You will be able to edit it in the settings later.
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Routing Number</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="routingNumber"
                options={{
                  required: true
                }}
                placeholder="123456789"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Account Number</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="accountNumber"
                options={{
                  required: true
                }}
                placeholder="123456789"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">
                Type of Bank Account
              </div>
              <Select
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="bankAccountType"
                onChange={(newValue: BankTypeEnum) =>
                  setValue("bankAccountType", newValue)
                }
                options={{
                  required: true
                }}
                placeholder="Choose"
                register={register}
                selectOptions={[{ label: "US", value: "US" }]}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Country</div>
              <Select
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="bankAddress.country"
                onChange={(newValue: string) =>
                  setValue("bankAddress", { country: newValue })
                }
                options={{
                  required: true
                }}
                placeholder="Choose Country"
                register={register}
                selectOptions={[{ label: "USA", value: "US" }]}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">First Name</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="firstName"
                options={{
                  required: true
                }}
                placeholder="First Name"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Last Name</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="lastName"
                options={{
                  required: true
                }}
                placeholder="Last Name"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Business Name</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="businessName"
                placeholder="Business (optional)"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Email</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="email"
                options={{
                  required: true,
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email address"
                  }
                }}
                placeholder="Email Address"
                register={register}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-[24px]">
              <div className="text-lg font-bold">Billing Address</div>
              <Input
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="billingAddress"
                options={{
                  required: true
                }}
                placeholder="Address 1"
                register={register}
                type="text"
              />
              <Input
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="alternativeAddress"
                options={{
                  required: true
                }}
                placeholder="Address 2"
                register={register}
                type="text"
              />
              <Input
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                errors={errors}
                name="city"
                options={{
                  required: true
                }}
                placeholder="City"
                register={register}
                type="text"
              />
              <div className="flex flex-row gap-3">
                <Input
                  className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="district"
                  options={{
                    required: true
                  }}
                  placeholder="State"
                  register={register}
                  type="text"
                />
                <Input
                  className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  errors={errors}
                  name="postalCode"
                  options={{
                    required: true
                  }}
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
                    className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                    errors={errors}
                    name="emailRecipient"
                    options={{
                      required: true,
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Invalid email address"
                      }
                    }}
                    placeholder=""
                    register={register}
                    type="text"
                  />
                  <div className="mt-2.5">
                    <label className="flex items-center">
                      <Checkbox
                        className="cursor-pointer rounded border-gray-300 bg-transparent bg-none text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600"
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
              <PassesPinkButton
                className="font-normal"
                isDisabled={isSubmitSuccessful}
                name="Confirm and Save"
                type={ButtonTypeEnum.SUBMIT}
              />
              <Button
                onClick={onFinishPaymentForm}
                style={{
                  background: "transparent",
                  width: "100%",
                  color: "#737893"
                }}
                variant="primary"
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
