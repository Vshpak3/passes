import { CircleEncryptionKeyResponseDto, PaymentApi } from "@passes/api-client"
import { SHA256 } from "crypto-js"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput } from "src/components/atoms"
import encrypt from "src/helpers/openpgp"
import { useLocalStorage, useUser } from "src/hooks"
import { v4 } from "uuid"

import { wrapApi } from "../../helpers/wrapApi"

const NewCard = () => {
  const [submitting, setSubmitting] = useState(false)
  const [publicKey, setPublicKey] = useState<CircleEncryptionKeyResponseDto>()
  const idempotencyKey = v4()

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {}
  })

  const [accessToken] = useLocalStorage("access-token", "")
  const { user, loading } = useUser()
  const router = useRouter()

  const onSubmit = async () => {
    setSubmitting(true)
    try {
      const values: any = getValues()
      const cardDetails = {
        number: values["card-number"].trim().replace(/\D/g, ""),
        cvv: values["cvv"]
      }
      const payload = {
        createCardDto: {
          idempotencyKey: idempotencyKey,
          keyId: "",
          encryptedData: "",
          billingDetails: {
            name: values["cardholder-name"],
            city: values["city"],
            country: values["country"],
            line1: values["address1"],
            line2: values["address2"],
            district: values["district"],
            postalCode: values["postal-code"]
          },
          expMonth: parseInt(values["exp-month"]),
          expYear: parseInt(values["exp-year"]),
          metadata: {
            sessionId: SHA256(accessToken).toString().substr(0, 50),
            ipAddress: "",
            phoneNumber: values["phone-number"],
            email: "bangbang@gmail.com"
          }
        },
        cardNumber: values["card-number"]
      }
      const encryptedData = await encrypt(
        cardDetails,
        publicKey as CircleEncryptionKeyResponseDto
      )
      const { encryptedMessage, keyId } = encryptedData

      payload.createCardDto.keyId = keyId
      payload.createCardDto.encryptedData = encryptedMessage

      const paymentApi = wrapApi(PaymentApi)
      //TODO: handle error on frontend (display some generic message)
      await paymentApi.paymentCreateCircleCard(
        { circleCreateCardAndExtraRequestDto: payload },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        }
      )
      router.push("/payment/default-payin-method")
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
    const fetchData = async () => {
      const paymentApi = new PaymentApi()
      setPublicKey(await paymentApi.paymentGetCircleEncryptionKey())
    }
    fetchData()
  }, [router, user, loading])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-classic">
      <FormInput
        register={register}
        type="text"
        name="card-number"
        placeholder="card number"
        options={{
          required: { message: "need card number", value: true },
          pattern: { message: "must be card number", value: /\d{16}/ }
        }}
        errors={errors}
      />
      <FormInput
        register={register}
        type="text"
        name="cvv"
        placeholder="cvv"
        options={{
          required: { message: "need card number", value: true },
          pattern: { message: "must be card number", value: /\d{3}/ }
        }}
        errors={errors}
      />
      <FormInput
        register={register}
        type="text"
        name="exp-month"
        placeholder="mm"
        options={{
          required: { message: "need a month", value: true },
          pattern: { message: "must be a month", value: /\d{2}/ }
        }}
        errors={errors}
      />
      <FormInput
        register={register}
        type="text"
        name="exp-year"
        placeholder="yyyy"
        options={{
          required: { message: "need a year", value: true },
          pattern: { message: "must be a year", value: /\d{4}/ }
        }}
        errors={errors}
      />
      <FormInput
        register={register}
        type="text"
        name="cardholder-name"
        placeholder="name on card"
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
            value: /[A-Z]{2}/
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
      <FormInput
        register={register}
        type="text"
        name="phone-number"
        placeholder="phone number"
        options={{
          required: { message: "need a postal code", value: true }
        }}
        errors={errors}
      />
      <button
        className="w-32 rounded-[50px] bg-passes-pink-100 p-4"
        type="submit"
        {...(submitting ? { disabled: true } : {})}
      />
    </form>
  )
}
export default NewCard
