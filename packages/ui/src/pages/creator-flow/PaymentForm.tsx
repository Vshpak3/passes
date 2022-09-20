import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
import { useRouter } from "next/router"
import CheckCircleFilled from "public/icons/check-circle-green.svg"
import CoinbaseIcon from "public/icons/coinbase-icon.svg"
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import TrelloIcon from "public/icons/trello-icon.svg"
import WalletConnectIcon from "public/icons/wallet-connect-icon.svg"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import {
  Button,
  ButtonTypeEnum,
  FormInput,
  PassesPinkButton
} from "src/components/atoms"
import { wrapApi } from "src/helpers"
import { v4 } from "uuid"

type PaymentFormProps = {
  onPaymentFormPageFinish?: () => void
}

enum BankTypeEnum {
  US,
  IBAN,
  NON_IBAN
}

const PaymentForm: React.FC<PaymentFormProps> = () => {
  const [bankType] = useState<BankTypeEnum>(BankTypeEnum.US)
  const idempotencyKey = v4()

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors }
  } = useForm({
    // resolver: yupResolver(bankingSchema)
  })

  const router = useRouter()

  console.log(watch())

  const onSubmit = async () => {
    console.log("submitting?")

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

      const paymentApi = wrapApi(PaymentApi)
      await paymentApi.createCircleBank({ circleCreateBankRequestDto: payload })
      router.push("/payment/default-payout-method")
    } catch (error: any) {
      toast.error(error)
      console.error(error)
    }
  }
  return (
    <div className="flex justify-center pb-20 text-white">
      <div className="flex w-4/5 max-w-screen-xl flex-col justify-between gap-6 sm:-mt-12 sm:flex-row">
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
            <div className="">
              <Button
                variant="primary"
                style={{
                  background: "rgba(255, 254, 255, 0.15)",
                  fontWeight: "bold",
                  width: "100%"
                }}
              >
                Download W9 Form
              </Button>
            </div>
            <div className="font-bold">
              <Button
                variant="primary"
                style={{
                  background: "rgba(255, 254, 255, 0.15)",
                  fontWeight: "bold",
                  width: "100%"
                }}
              >
                Upload W9 Form
              </Button>
            </div>
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
              <div className="font-bold">
                Your Bank Account Data for Payouts
              </div>
              <div className="text-xs text-[#b3bee7] opacity-[0.6]">
                You will be able to edit it in the settings later.
              </div>
            </div>

            <div className="flex flex-col gap-[6px]">
              <div className="text-[#b3bee7] opacity-[0.6]">Routing Number</div>
              <FormInput
                register={register}
                name="routingNumber"
                className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                placeholder="4444 1902 0192 0100"
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
                placeholder="-"
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
                placeholder="Email"
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
              <div className="text-base font-bold">
                Or Use Your Crypto Wallet for Payouts
              </div>
              <div className="flex flex-row gap-5">
                <MetamaskIcon />
                <CoinbaseIcon />
                <TrelloIcon />
                <PhantomIcon />
                <WalletConnectIcon />
              </div>
              <div>
                <div className="flex flex-col gap-[6px]">
                  <div className="text-base font-bold">
                    Send email recipents to
                  </div>
                  <FormInput
                    register={register}
                    name="email"
                    className="w-full border-[#34343ACC] bg-black text-white focus:border-[#9C4DC180] focus:ring-[#9C4DC180]"
                    placeholder="lucy@passes.com"
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
                  <div>
                    <FormInput
                      register={register}
                      type="checkbox"
                      name="termsAndConditions"
                      label="I agree to Client Terms and Conditions and moment.com Terms and Conditions"
                      className="rounded border-gray-300 bg-gray-100 text-[#9C4DC1] focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      labelClassName="text-[#b3bee7] opacity-[0.6]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <PassesPinkButton
                // onClick={onPaymentFormPageFinish}
                name="Confirm and Save"
                type={ButtonTypeEnum.SUBMIT}
                className="font-normal"
              />
              <Button
                variant="primary"
                style={{
                  background: "transparent",
                  width: "100%",
                  color: "#737893"
                }}
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
