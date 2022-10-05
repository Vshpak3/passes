import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { CircleEncryptionKeyResponseDto, PaymentApi } from "@passes/api-client"
import cardValidator from "card-validator"
import { SHA256 } from "crypto-js"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import { useRouter } from "next/router"
import InfoIcon from "public/icons/info-icon.svg"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { CreditCardInput, FormInput, Select } from "src/components/atoms"
import { EIcon } from "src/components/atoms/Input"
import Tab from "src/components/pages/settings/Tab"
import { SubTabsEnum } from "src/config/settings"
import { ISettingsContext, useSettings } from "src/contexts/settings"
import { COUNTRIES, US_STATES } from "src/helpers/countries"
import { getExpirationYears } from "src/helpers/dates"
import { errorMessage } from "src/helpers/error"
import encrypt from "src/helpers/openpgp"
import { useUser } from "src/hooks"
import { v4 } from "uuid"
interface IAddCard {
  callback?: () => void
}
const AddCard = ({ callback }: IAddCard) => {
  const { addOrPopStackHandler } = useSettings() as ISettingsContext
  const [publicKey, setPublicKey] = useState<CircleEncryptionKeyResponseDto>()
  const idempotencyKey = v4()

  const {
    handleSubmit,
    register,
    control,
    watch,
    getValues,
    formState: { errors }
  } = useForm<{ country: string; "card-number": string }>({
    defaultValues: {}
  })

  const { user, loading, accessToken } = useUser()
  const router = useRouter()
  const countrySelected = watch("country")

  const onSubmit = async () => {
    try {
      const values: any = getValues()
      const cardDetails = {
        number: values["card-number"]
          .trim()
          .replace(/\D/g, "")
          .replace(/\s/g, ""),
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
      payload.createCardDto.keyId = keyId
      payload.createCardDto.encryptedData = encryptedMessage

      const paymentApi = new PaymentApi()
      await paymentApi.createCircleCard({
        circleCreateCardAndExtraRequestDto: payload
      })
      toast.success("Credit card added succesfully")
      if (callback) {
        callback()
      } else {
        addOrPopStackHandler(SubTabsEnum.PaymentSettings)
      }
    } catch (error: any) {
      const toastError = await errorMessage(error)

      toast.error(toastError)
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

      <span className="mt-3 block text-[16px] font-[500] text-white">
        Card Info
      </span>
      <CreditCardInput
        control={control}
        name="card-number"
        rules={{
          required: { message: "Card number is required", value: true },
          validate: {
            value: (value: any) => {
              const numberValidation = cardValidator.number(value)

              return numberValidation.isValid
                ? ""
                : "Credit card number is invalid"
            }
          }
        }}
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
        className="mt-4 border-passes-dark-100 bg-transparent"
      />
      <div className="mt-4 flex flex-row gap-4">
        <div className="flex flex-col">
          <span className="text-[16px] font-[500] text-[#767676]">Month</span>
          <Select
            register={register}
            placeholder=" "
            selectOptions={[
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12"
            ]}
            options={{
              required: { message: "Month is required", value: true }
            }}
            errors={errors}
            name="exp-month"
            className="mt-2 w-[100px] border-passes-dark-100 bg-transparent"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-[500] text-[#767676]">Year</span>
          <Select
            register={register}
            selectOptions={getExpirationYears()}
            placeholder=" "
            options={{
              required: { message: "Year is required", value: true }
            }}
            errors={errors}
            name="exp-year"
            className="mt-2 w-[100px] border-passes-dark-100 bg-transparent"
          />
        </div>
        <div className="mb-4 flex flex-col">
          <span className="text-[16px] font-[500] text-[#767676]">CVV</span>
          <FormInput
            register={register}
            type="number"
            name="cvv"
            placeholder="080"
            errors={errors}
            options={{
              required: {
                message: "CVV is required",
                value: true
              },
              pattern: { message: "must be CVV number", value: /\d{3}/ }
            }}
            className="mt-2 w-[71px] border-passes-dark-100 bg-transparent"
          />
        </div>
      </div>
      <span className="mt-4 text-[16px] font-[500]">Billing address</span>
      <FormInput
        register={register}
        type="text"
        name="address1"
        placeholder="Address 1"
        errors={errors}
        options={{
          required: { message: "Address is required", value: true }
        }}
        className="mt-3 border-passes-dark-100 bg-transparent"
      />
      <FormInput
        register={register}
        type="text"
        name="address2"
        placeholder="Address 2"
        errors={errors}
        className="mt-3 border-passes-dark-100 bg-transparent"
      />
      <FormInput
        register={register}
        type="select"
        selectOptions={COUNTRIES}
        name="country"
        errors={errors}
        className="mt-3 border-passes-dark-100 bg-transparent"
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
        className="mt-3 border-passes-dark-100 bg-transparent"
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
            className="mt-3 w-[120px] border-passes-dark-100 bg-transparent"
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
                className="tooltip absolute right-[15px] top-[30px] h-4 w-4"
                data-tip="2 letter input only (Example: “FL”)"
              >
                <InfoIcon />
              </div>
            }
            errors={errors}
            className="mt-3 border-passes-dark-100 bg-transparent"
          />
        )}

        <FormInput
          register={register}
          type="text"
          name="postal-code"
          placeholder="Zip"
          errors={errors}
          options={{
            required: { message: "Postal code is required", value: true }
          }}
          className="mt-3 border-passes-dark-100 bg-transparent"
        />
      </div>
      <button
        className="mt-4 mb-8 flex h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-full border border-passes-pink-100 bg-passes-pink-100 px-2 text-white"
        onClick={handleSubmit(onSubmit)}
      >
        <span className="text-[16px] font-[500]">Confirm and Continue</span>
      </button>
    </>
  )
}

export default AddCard
