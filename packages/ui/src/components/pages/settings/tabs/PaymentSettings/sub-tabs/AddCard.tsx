import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { yupResolver } from "@hookform/resolvers/yup"
import { CircleEncryptionKeyResponseDto, PaymentApi } from "@passes/api-client"
import cardValidator from "card-validator"
import { SHA256 } from "crypto-js"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import InfoIcon from "public/icons/info-icon.svg"
import { FC, memo, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { v4 } from "uuid"
import { object, string } from "yup"

import { Button } from "src/components/atoms/button/Button"
import { CreditCardInput } from "src/components/atoms/CreditCardInput"
import { EIcon, Input } from "src/components/atoms/input/GeneralInput"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { Select } from "src/components/atoms/input/Select"
import { Tab } from "src/components/pages/settings/Tab"
import { FULL_NAME_REGEX } from "src/config/name"
import { SubTabsEnum } from "src/config/settings"
import { SettingsContextProps, useSettings } from "src/contexts/Settings"
import { COUNTRIES, US_STATES } from "src/helpers/countries"
import { getExpirationYears } from "src/helpers/dates"
import { errorMessage } from "src/helpers/error"
import { encrypt } from "src/helpers/openpgp"
import { sleep } from "src/helpers/sleep"
import { usePayinMethod } from "src/hooks/usePayinMethod"
import { useUser } from "src/hooks/useUser"

interface AddCardProps {
  callback?: () => void
}

interface CardForm {
  "card-holder": string
  "card-number": string // eslint-disable-line sonarjs/no-duplicate-string
  "exp-month": string
  "exp-year": string
  "postal-code": string
  address1: string
  address2: string
  city: string
  country: string
  cvv: string
  district: string
}

const cardForm = object({
  "card-holder": string()
    .required("Name is required")
    .matches(FULL_NAME_REGEX, "Please enter a valid full name"),
  "card-number": string().required("Card number is required"),
  "exp-month": string().required("Month is required"),
  "exp-year": string().required("Year is required"),
  "postal-code": string()
    .required("Postal code is required")
    .matches(/^\d{5}$/, "Post code must be a 5 digit number"),
  address1: string().required("Address is required"),
  address2: string().optional(),
  city: string().required("City is required"),
  country: string().required("Country is required"),
  cvv: string()
    .required("CVV is required")
    .matches(/^\d{3}$/, "CVV number must be a 3 digit number"),
  district: string().required("State is required")
})

const AddCard: FC<AddCardProps> = ({ callback }) => {
  const { addOrPopStackHandler } = useSettings() as SettingsContextProps
  const [publicKey, setPublicKey] = useState<CircleEncryptionKeyResponseDto>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    control,
    watch,
    getValues,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<CardForm>({
    defaultValues: {
      country: COUNTRIES[0]
    },
    resolver: yupResolver(cardForm)
  })

  const { addCard } = usePayinMethod()

  const idempotencyKey = v4()

  const { accessToken } = useUser()
  const countrySelected = watch("country")

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)
      const values = getValues()

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
            sessionId: SHA256(accessToken).toString().substring(0, 50),
            ipAddress: ""
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

      await addCard(payload)
      toast.success("Credit card added succesfully")
      await sleep("1 second")
      if (callback) {
        callback()
      } else {
        addOrPopStackHandler(SubTabsEnum.PaymentSettings)
      }
    } catch (error: unknown) {
      errorMessage(error, true)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const paymentApi = new PaymentApi()
      setPublicKey(await paymentApi.getCircleEncryptionKey())
    }
    fetchData()
  }, [])

  const years = useMemo(getExpirationYears, [])

  return (
    <>
      <Tab title="Add Card" withBack />

      <span className="mt-3 block text-[16px] font-[500] text-white">
        Card Info
      </span>
      <CreditCardInput
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        control={control as any}
        name="card-number"
        rules={{
          required: { message: "Card number is required", value: true },
          validate: {
            value: (value) => {
              const numberValidation = cardValidator.number(value)

              return numberValidation.isValid
                ? true
                : "Credit card number is invalid"
            }
          }
        }}
      />
      <Input
        className="mt-4"
        errors={errors}
        name="card-holder"
        placeholder="Card holder"
        register={register}
        type="text"
      />
      <div className="mt-4 flex flex-row gap-4">
        <div className="flex flex-col">
          <span className="text-[16px] font-[500] text-[#767676]">Month</span>
          <Select
            className="mt-2 w-[100px]"
            errors={errors}
            name="exp-month"
            onChange={(month: string) => setValue("exp-month", month)}
            register={register}
            selectOptions={Array.from(Array(12).keys()).map((key) =>
              String(key + 1)
            )}
            value={getValues("exp-month") || undefined}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-[500] text-[#767676]">Year</span>
          <Select
            className="mt-2 w-[100px]"
            errors={errors}
            name="exp-year"
            onChange={(year: string) => setValue("exp-year", year)}
            placeholder=" "
            register={register}
            selectOptions={years}
            value={getValues("exp-year")}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <span className="text-[16px] font-[500] text-[#767676]">CVV</span>
          <NumberInput
            className="mt-2 min-h-[50px] w-[71px]"
            errors={errors}
            maxInput={999}
            name="cvv"
            register={register}
            type="integer"
          />
        </div>
      </div>
      <span className="mt-4 text-[16px] font-[500]">Billing address</span>
      <Input
        className="mt-3"
        errors={errors}
        name="address1"
        placeholder="Address 1"
        register={register}
        type="text"
      />
      <Input
        className="mt-3"
        errors={errors}
        name="address2"
        placeholder="Address 2"
        register={register}
        type="text"
      />
      <Select
        className="mt-3"
        defaultValue={COUNTRIES[0]}
        errors={errors}
        name="country"
        onChange={(newValue: string) => setValue("country", newValue)}
        placeholder="Country"
        register={register}
        selectOptions={COUNTRIES}
      />
      <Input
        className="mt-3"
        errors={errors}
        name="city"
        placeholder="City"
        register={register}
        type="text"
      />
      <div className="flex gap-4">
        {countrySelected === COUNTRIES[0] ? (
          <Select
            className="mt-3 w-[120px]"
            errors={errors}
            name="district"
            onChange={(newValue: string) => setValue("district", newValue)}
            placeholder="State"
            register={register}
            selectOptions={US_STATES}
            showOnTop
          />
        ) : (
          <Input
            className="mt-3"
            errors={errors}
            icon={
              <div
                className="absolute right-[15px] top-[30px] h-4 w-4"
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
          className="mt-3"
          errors={errors}
          name="postal-code"
          placeholder="Zip"
          register={register}
          type="text"
        />
      </div>
      <Button
        className="mt-4 mb-8 w-full text-[16px] font-[500]"
        disabled={isSubmitting}
        onClick={handleSubmit(onSubmit)}
        variant="pink"
      >
        {isSubmitting ? "Submitting ..." : "Confirm and Continue"}
      </Button>
    </>
  )
}

export default memo(AddCard) // eslint-disable-line import/no-default-export
