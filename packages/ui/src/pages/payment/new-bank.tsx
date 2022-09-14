import { CircleCreateBankRequestDto, PaymentApi } from "@passes/api-client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput } from "src/components/atoms"
import { useUser } from "src/hooks"
import { v4 } from "uuid"

import AuthOnlyWrapper from "../../components/wrappers/AuthOnly"
import { wrapApi } from "../../helpers"

enum BankTypeEnum {
  US,
  IBAN,
  NON_IBAN
}
const NewCard = () => {
  const [submitting, setSubmitting] = useState(false)
  const [bankType, setBankType] = useState<BankTypeEnum>(BankTypeEnum.US)
  const idempotencyKey = v4()

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
    setSubmitting(true)
    try {
      const values: any = getValues()
      const payload: CircleCreateBankRequestDto = {
        idempotencyKey: idempotencyKey,
        accountNumber:
          bankType === BankTypeEnum.US || bankType == BankTypeEnum.NON_IBAN
            ? values["account-number"]
            : undefined,
        routingNumber:
          bankType === BankTypeEnum.US || bankType == BankTypeEnum.NON_IBAN
            ? values["routing-number"]
            : undefined,
        iban: bankType === BankTypeEnum.IBAN ? values["iban"] : undefined,
        billingDetails: {
          name: values["bankowner-name"],
          city: values["city"],
          country: values["country"],
          line1: values["address1"],
          line2: values["address2"],
          district: values["district"],
          postalCode: values["postal-code"]
        },
        bankAddress: {
          bankName: values["bank-name"],
          city: values["bank-city"],
          country: values["bank-country"]
        }
      }

      const paymentApi = wrapApi(PaymentApi)
      //TODO: handle error on frontend (display some generic message)
      await paymentApi.createCircleBank({ circleCreateBankRequestDto: payload })
      router.push("/payment/default-payout-method")
    } catch (error: any) {
      toast.error(error)
    } finally {
      setSubmitting(false)
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
    <AuthOnlyWrapper isPage>
      <div>
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
        <button></button>
        <form onSubmit={handleSubmit(onSubmit)} className="form-classic">
          {(bankType === BankTypeEnum.US ||
            bankType === BankTypeEnum.NON_IBAN) && (
            <div>
              <FormInput
                register={register}
                type="text"
                name="account-number"
                placeholder="Account number"
                options={{
                  required: { message: "need account number", value: true },
                  pattern: { message: "must be a month", value: /^\d*$/ }
                }}
                errors={errors}
              />
              <FormInput
                register={register}
                type="text"
                name="routing-number"
                placeholder="Routing number"
                options={{
                  required: { message: "need routing number", value: true },
                  pattern: { message: "must be a month", value: /^\d*$/ }
                }}
                errors={errors}
              />
            </div>
          )}
          {bankType === BankTypeEnum.IBAN && (
            <FormInput
              register={register}
              type="text"
              name="iban"
              placeholder="IBAN"
              options={{
                required: { message: "need a month", value: true },
                pattern: {
                  message: "must be a month",
                  value: /^[A-Z]{2}[A-Z\d]*$/
                }
              }}
              errors={errors}
            />
          )}
          Bank Info:
          <FormInput
            register={register}
            type="text"
            name="bank-name"
            placeholder="Bank Name"
            options={{
              required: { message: "need a a bank name", value: true }
            }}
            errors={errors}
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
          />
          <FormInput
            register={register}
            type="text"
            name="bank-country"
            placeholder="Bank Country (2 letters)"
            options={{
              required: { message: "need a bank country", value: true },
              pattern: {
                message: "must be 2 letter country code",
                value: /^[A-Z]{2}$/
              }
            }}
            errors={errors}
          />
          Billing Info:
          <FormInput
            register={register}
            type="text"
            name="bankowner-name"
            placeholder="name of owner"
            options={{
              required: { message: "need a name", value: true }
            }}
            errors={errors}
          />
          <FormInput
            register={register}
            type="text"
            name="city"
            placeholder="city"
            options={{
              required: { message: "need a city", value: true }
            }}
            errors={errors}
          />
          <FormInput
            register={register}
            type="text"
            name="address1"
            placeholder="address line 1"
            options={{
              required: { message: "need an address", value: true }
            }}
            errors={errors}
          />
          <FormInput
            register={register}
            type="text"
            name="address2"
            placeholder="address line 2"
            errors={errors}
          />
          <FormInput
            register={register}
            type="text"
            name="postal-code"
            placeholder="postal code"
            options={{
              required: { message: "need a postal code", value: true }
            }}
            errors={errors}
          />
          <FormInput
            register={register}
            type="text"
            name="country"
            placeholder="country (2 letters)"
            options={{
              required: { message: "need a country", value: true },
              pattern: {
                message: "must be 2 letter country code",
                value: /^[A-Z]{2}$/
              }
            }}
            errors={errors}
          />
          <FormInput
            register={register}
            type="text"
            name="district"
            placeholder="district/state (2 letter code required for US or Canada)"
            errors={errors}
          />
          <button
            className="w-32 rounded-[50px] bg-passes-pink-100 p-4"
            type="submit"
            {...(submitting ? { disabled: true } : {})}
          />
        </form>
      </div>
    </AuthOnlyWrapper>
  )
}
export default NewCard
