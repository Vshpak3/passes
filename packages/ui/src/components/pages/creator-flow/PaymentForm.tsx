import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
import Link from "next/link"
import CheckCircleFilled from "public/icons/check-circle-green.svg"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import {
  Button,
  ButtonTypeEnum,
  FormInput,
  PassesPinkButton
} from "src/components/atoms"
import DownloadW9FormButton from "src/components/atoms/DownloadW9FormButton"
import UploadW9FormButton from "src/components/atoms/UploadW9FormButton"
import { errorMessage } from "src/helpers/error"
import { v4 } from "uuid"

type PaymentFormProps = {
  onFinishPaymentForm: (isSubmitedBankDetails?: boolean) => void
}

enum BankTypeEnum {
  US,
  IBAN,
  NON_IBAN
}

const PaymentForm: FC<PaymentFormProps> = ({ onFinishPaymentForm }) => {
  const [bankType] = useState<BankTypeEnum>(BankTypeEnum.US)
  const idempotencyKey = v4()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitSuccessful }
  } = useForm()

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
    } catch (error: any) {
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
            <UploadW9FormButton text="Upload W9 Form" icon={false} />
          </div>
        </div>
        <form
          onSubmit={(e) => {
            handleSubmit(onSubmit)(e).catch((err) => {
              toast.error(err)
              console.error(`errors: ${err}`)
            })
          }}
          className="flex-[67]"
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
              <FormInput
                register={register}
                name="routingNumber"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="123456789"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Account Number</div>
              <FormInput
                register={register}
                name="accountNumber"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="123456789"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">
                Type of Bank Account
              </div>
              <FormInput
                register={register}
                name="bankAccountType"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Choose"
                type="select"
                errors={errors}
                options={{
                  required: true
                }}
                selectOptions={[{ label: "US", value: "US" }]}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Country</div>
              <FormInput
                register={register}
                name="bankAddress.country"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Choose Country"
                type="select"
                errors={errors}
                options={{
                  required: true
                }}
                selectOptions={[{ label: "USA", value: "US" }]}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">First Name</div>
              <FormInput
                register={register}
                name="firstName"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="First Name"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Last Name</div>
              <FormInput
                register={register}
                name="lastName"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Last Name"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Business Name</div>
              <FormInput
                register={register}
                name="businessName"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Business (optional)"
                type="text"
                errors={errors}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Email</div>
              <FormInput
                register={register}
                name="email"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Email Address"
                type="text"
                errors={errors}
                options={{
                  required: true,
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email address"
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-[24px]">
              <div className="text-lg font-bold">Billing Address</div>
              <FormInput
                register={register}
                name="billingAddress"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Address 1"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
              <FormInput
                register={register}
                name="alternativeAddress"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="Address 2"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
              <FormInput
                register={register}
                name="city"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="City"
                type="text"
                errors={errors}
                options={{
                  required: true
                }}
              />
              <div className="flex flex-row gap-3">
                <FormInput
                  register={register}
                  name="district"
                  className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="State"
                  type="text"
                  errors={errors}
                  options={{
                    required: true
                  }}
                />
                <FormInput
                  register={register}
                  name="postalCode"
                  className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                  placeholder="Zip Code"
                  type="text"
                  errors={errors}
                  options={{
                    required: true
                  }}
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
                    Send email recipents to
                  </div>
                  <FormInput
                    register={register}
                    name="emailRecipient"
                    className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                    placeholder=""
                    type="text"
                    errors={errors}
                    options={{
                      required: true,
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Invalid email address"
                      }
                    }}
                  />
                  <div className="mt-2.5">
                    <label className="flex items-center">
                      <FormInput
                        register={register}
                        type="checkbox"
                        name="termsAndConditions"
                        className="cursor-pointer rounded border-gray-300 bg-transparent bg-none text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600"
                      />
                      <span className="text-base">
                        By checking this box I agree to Passes
                        <Link href="/terms">
                          <a className="text-passes-pink-100">
                            {" "}
                            Terms and Conditions
                          </a>
                        </Link>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <PassesPinkButton
                name="Confirm and Save"
                type={ButtonTypeEnum.SUBMIT}
                className="font-normal"
                isDisabled={isSubmitSuccessful}
              />
              <Button
                variant="primary"
                style={{
                  background: "transparent",
                  width: "100%",
                  color: "#737893"
                }}
                onClick={() => onFinishPaymentForm()}
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

export default PaymentForm
