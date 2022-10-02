import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { CircleEncryptionKeyResponseDto, PaymentApi } from "@passes/api-client"
import { SHA256 } from "crypto-js"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import { useRouter } from "next/router"
import AmexCardIcon from "public/icons/amex-icon.svg"
import DiscoverCardIcon from "public/icons/discover-icon.svg"
import InfoIcon from "public/icons/info-icon.svg"
import MasterCardIcon from "public/icons/mastercard-icon.svg"
import VisaIcon from "public/icons/visa-icon.svg"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput } from "src/components/atoms"
import Tab from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import { COUNTRIES } from "src/helpers/countries"
import encrypt from "src/helpers/openpgp"
import { useUser } from "src/hooks"
import { v4 } from "uuid"

const AddCard = () => {
  const { addOrPopStackHandler } = useSettings() as ISettingsContext
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

  const { user, loading, accessToken } = useUser()
  const router = useRouter()

  const onSubmit = async () => {
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
            name: values["card-holder"],
            city: values["city"],
            country: iso3311a2.getCode(values["country"]),
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
            phoneNumber: values["phone-number"]
          }
        },
        cardNumber: values["card-number"]
      }

      const encryptedData = await encrypt(
        cardDetails,
        publicKey as CircleEncryptionKeyResponseDto
      )
      const { encryptedMessage, keyId } = encryptedData
      console.log(encryptedMessage)
      payload.createCardDto.keyId = keyId
      payload.createCardDto.encryptedData = encryptedMessage

      const paymentApi = new PaymentApi()
      console.log("create")
      await paymentApi.createCircleCard({
        circleCreateCardAndExtraRequestDto: payload
      })
      addOrPopStackHandler(SubTabsEnum.PaymentSettings)
    } catch (error: any) {
      toast.error(error)
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
      setPublicKey(await paymentApi.getCircleEncryptionKey())
    }
    fetchData()
  }, [router, user, loading])
  return (
    <>
      <Tab withBack title="Add Card" />

      <span className="text-[16px] font-[500] text-[#767676]">Card Info</span>
      <FormInput
        register={register}
        type="text"
        name="card-number"
        placeholder="4444 1902 0192 0100"
        errors={errors}
        options={{
          required: { message: "Card number is required", value: true }
        }}
        icon={
          <div className="absolute left-[240px] top-[15px] flex h-8 w-8 flex-row gap-2">
            <DiscoverCardIcon />
            <AmexCardIcon />
            <MasterCardIcon />
            <VisaIcon />
          </div>
        }
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
      />
      <FormInput
        register={register}
        type="text"
        name="card-holder"
        placeholder="Card holder"
        errors={errors}
        options={{
          required: { message: "Name is required", value: true }
        }}
        className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
      />
      <div className="flex flex-row gap-4">
        <div className="flex flex-col">
          <span className="text-[16px] font-[500] text-[#767676]">Month</span>
          <FormInput
            register={register}
            type="text"
            name="exp-month"
            placeholder="08"
            errors={errors}
            options={{
              required: { message: "Month is required", value: true },
              pattern: { message: "must be a month", value: /\d{2}/ }
            }}
            className="mt-2 mb-4 w-[61px] border-passes-dark-100 bg-transparent"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-[500] text-[#767676]">Year</span>
          <FormInput
            register={register}
            type="text"
            name="exp-year"
            placeholder="2024"
            errors={errors}
            options={{
              required: { message: "Year is required", value: true },
              pattern: { message: "must be a year", value: /\d{4}/ }
            }}
            className="mt-2 mb-4 w-[81px] border-passes-dark-100 bg-transparent"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-[500] text-[#767676]">CVV</span>
          <FormInput
            register={register}
            type="text"
            name="cvv"
            placeholder="080"
            errors={errors}
            options={{
              required: { message: "Card number is required", value: true },
              pattern: { message: "must be card number", value: /\d{3}/ }
            }}
            className="mt-2 mb-4 w-[71px] border-passes-dark-100 bg-transparent"
          />
        </div>
      </div>
      <span className="text-[16px] font-[500]">Billing address</span>
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
        <FormInput
          register={register}
          type="text"
          name="district"
          placeholder="State/District"
          icon={
            <div
              className="tooltip absolute left-[165px] top-[26px] h-4 w-4"
              data-tip="2 letter input only (Example: “FL”)"
            >
              <InfoIcon />
            </div>
          }
          errors={errors}
          className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
        />

        <FormInput
          register={register}
          type="text"
          name="postal-code"
          placeholder="Zip"
          errors={errors}
          options={{
            required: { message: "Postal code is required", value: true }
          }}
          className="mt-2 mb-4 border-passes-dark-100 bg-transparent"
        />
      </div>
      <button
        className="mb-8 flex h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-full border border-passes-pink-100 bg-passes-pink-100 px-2 text-white"
        onClick={handleSubmit(onSubmit)}
      >
        <span className="text-[16px] font-[500]">Confirm and Continue</span>
      </button>
    </>
  )
}

export default AddCard
