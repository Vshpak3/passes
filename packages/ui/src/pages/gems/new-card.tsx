import { EncryptionKeyDto, PaymentApi } from "@moment/api-client"
import { SHA256 } from "crypto-js"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"

import { FormInput } from "../../components/form/form-input"
import encrypt from "../../helpers/openpgp"
import useLocalStorage from "../../hooks/useLocalStorage"
import useUser from "../../hooks/useUser"

const NewCard = () => {
  const [submitting, setSubmitting] = useState(false)
  const [publicKey, setPublicKey] = useState<EncryptionKeyDto>()
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
            email: ""
          }
        },
        fourDigits: values["card-number"].slice(12)
      }
      const encryptedData = await encrypt(
        cardDetails,
        publicKey as EncryptionKeyDto
      )
      const { encryptedMessage, keyId } = encryptedData

      payload.createCardDto.keyId = keyId
      payload.createCardDto.encryptedData = encryptedMessage

      const paymentApi = new PaymentApi()
      //TODO: handle error on frontend (display some generic message)
      console.log(payload)
      console.log(JSON.stringify(payload))
      await paymentApi.paymentCreateCard(
        { createCardAndExtraDto: payload },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
          }
        }
      )
      //TODO: handle returning back to previous page
      router.push("/gems/buy")
    } catch (error) {
      console.log(error)
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
      setPublicKey(await paymentApi.paymentGetEncryptionKey())
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
        placeholder="district/state (2 letters)"
        options={{
          required: { message: "need a district/state", value: true },
          pattern: {
            message: "must be 2 letter district/state code",
            value: /[A-Z]{2}/
          }
        }}
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
        className="w-32 rounded-[50px] bg-[#C943A8] p-4"
        type="submit"
        {...(submitting ? { disabled: true } : {})}
      />
    </form>
  )
}
export default NewCard
