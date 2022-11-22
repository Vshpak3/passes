import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { yupResolver } from "@hookform/resolvers/yup"
import { CircleEncryptionKeyResponseDto, PaymentApi } from "@passes/api-client"
import cardValidator from "card-validator"
import classNames from "classnames"
import { SHA256 } from "crypto-js"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import iso3311a2 from "iso-3166-1-alpha-2"
import ArrowRightIcon from "public/icons/arrow-right.svg"
import InfoIcon from "public/icons/info-icon.svg"
import { FC, memo, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { v4 } from "uuid"
import { object, string } from "yup"

import { Button, ButtonTypeEnum } from "src/components/atoms/button/Button"
import { CreditCardInput } from "src/components/atoms/CreditCardInput"
import { EIcon, Input } from "src/components/atoms/input/GeneralInput"
import { NativeSelect } from "src/components/atoms/input/NativeSelect"
import { NumberInput } from "src/components/atoms/input/NumberInput"
import { FULL_NAME_REGEX } from "src/config/name"
import { COUNTRIES, US_STATES } from "src/helpers/countries"
import { getExpirationYears } from "src/helpers/dates"
import { isProd } from "src/helpers/env"
import { errorMessage } from "src/helpers/error"
import { encrypt } from "src/helpers/openpgp"
import { sleep } from "src/helpers/sleep"
import { usePayinMethod } from "src/hooks/usePayinMethod"
import { useUser } from "src/hooks/useUser"

interface NewCardProps {
  callback?: () => void
  isEmbedded?: boolean
}

interface CardForm {
  "cc-name": string
  "cc-number": string
  "cc-exp-month": string
  "cc-exp-year": string
  "cc-csc": string
  "postal-code": string
  "address-line1": string
  "address-line2": string
  city: string
  country: string
  district: string
}

const cardForm = object({
  "cc-name": string()
    .required("Name is required")
    .matches(FULL_NAME_REGEX, "Please enter a valid full name"),
  "cc-number": string()
    .test("is-credit-card-valid", "Card number is invalid", function (value) {
      if (!isProd && value === "4007 0000 0000 0007") {
        return true
      }
      return cardValidator.number(value).isValid
    })
    .test("is-not-mex", "Amex unsupported", function (value) {
      if (!value) {
        return false
      }
      const nospaces = value.replace(/\s/g, "")
      return !nospaces?.match(/^3[47]\d{13,14}$/)?.length
    })
    .required("Card number is required"),
  "cc-exp-month": string().required("Month is required"),
  "cc-exp-year": string().required("Year is required"),
  "postal-code": string()
    .required("Postal code is required")
    .matches(/^\d{5}$/, "Post code must be a 5 digit number"),
  "address-line1": string().required("Address is required"),
  "address-line2": string().optional(),
  city: string().required("City is required"),
  country: string().required("Country is required"),
  "cc-csc": string()
    .required("CVV is required")
    .matches(/^\d{3}$/, "CVV number must be a 3 digit number"),
  district: string().required("State is required")
})

const NewCardUnmemo: FC<NewCardProps> = ({ callback, isEmbedded = false }) => {
  const [publicKey, setPublicKey] = useState<CircleEncryptionKeyResponseDto>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    control,
    watch,
    handleSubmit,
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

  const onSubmit = async (values: CardForm) => {
    try {
      setIsSubmitting(true)

      const cardDetails = {
        number: values["cc-number"]
          .trim()
          .replace(/\D/g, "")
          .replace(/\s/g, ""),
        cvv: values["cc-csc"]
      }
      const payload = {
        createCardDto: {
          idempotencyKey: idempotencyKey,
          keyId: "",
          encryptedData: "",
          billingDetails: {
            name: values["cc-name"],
            city: values["city"],
            country: iso3311a2.getCode(values["country"]),
            line1: values["address-line1"],
            line2: values["address-line2"],
            district: values["district"],
            postalCode: values["postal-code"]
          },
          expMonth: parseInt(values["cc-exp-month"]),
          expYear: parseInt(values["cc-exp-year"]),
          metadata: {
            sessionId: SHA256(accessToken).toString().substring(0, 50),
            ipAddress: ""
          }
        },
        cardNumber: values["cc-number"]
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
      await sleep("3 second") // waiting for circle
      if (callback) {
        callback()
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-3 flex w-full flex-row justify-between">
        {isEmbedded && (
          <div
            className="text-passes-primary-color underline hover:cursor-pointer"
            onClick={callback}
          >
            <ArrowRightIcon />
          </div>
        )}
        <span className="block text-[16px] font-[500]">Card Info</span>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CreditCardInput control={control as any} name="cc-number" />
      <Input
        autoComplete="cc-name"
        className="mt-4"
        errors={errors}
        name="cc-name"
        placeholder="Card holder"
        register={register}
        type="text"
      />
      <div className="mt-2 flex flex-row gap-4">
        <div className="flex flex-col">
          <NativeSelect
            autoComplete="cc-exp-month"
            className="mt-2 w-[100px]"
            errors={errors}
            name="cc-exp-month"
            placeholder="Month"
            register={register}
            selectOptions={Array.from(Array(12).keys()).map((key) =>
              String(key + 1)
            )}
          />
        </div>
        <div className="flex flex-col">
          <NativeSelect
            autoComplete="cc-exp-year"
            className="mt-2 w-[100px]"
            errors={errors}
            name="cc-exp-year"
            placeholder="Year"
            register={register}
            selectOptions={years}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <NumberInput
            autoComplete="cc-csc"
            className="mt-2 min-h-[50px] w-[71px] border-passes-dark-100"
            errors={errors}
            maxInput={999}
            name="cc-csc"
            placeholder="CVV"
            register={register}
            type="integer"
          />
        </div>
      </div>
      <span className="mt-4 text-[16px] font-[500]">Billing address</span>
      <Input
        autoComplete="address-line1"
        className="mt-3"
        errors={errors}
        name="address-line1"
        placeholder="Address 1"
        register={register}
        type="text"
      />
      <Input
        autoComplete="address-line2"
        className="mt-3"
        errors={errors}
        name="address-line2"
        placeholder="Address 2"
        register={register}
        type="text"
      />
      <NativeSelect
        autoComplete="country"
        className="mt-3"
        defaultValue={COUNTRIES[0]}
        errors={errors}
        name="country"
        placeholder="Country"
        register={register}
        selectOptions={COUNTRIES}
      />
      <Input
        autoComplete="address-level2"
        className="mt-3"
        errors={errors}
        name="city"
        placeholder="City"
        register={register}
        type="text"
      />
      <div className="flex gap-4">
        {countrySelected === COUNTRIES[0] ? (
          <NativeSelect
            autoComplete="address-level1"
            className="mt-3 w-[120px]"
            errors={errors}
            name="district"
            placeholder="State"
            register={register}
            selectOptions={US_STATES}
          />
        ) : (
          <Input
            autoComplete="address-level1"
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
          autoComplete="postal-code"
          className="mt-3"
          errors={errors}
          name="postal-code"
          placeholder="Zip"
          register={register}
          type="text"
        />
      </div>
      <Button
        className={classNames(
          isEmbedded ? "mb-4" : "mb-8",
          "mt-4 w-full text-[16px] font-[500]"
        )}
        disabled={isSubmitting}
        type={ButtonTypeEnum.SUBMIT}
      >
        {isSubmitting ? "Submitting ..." : "Confirm and Continue"}
      </Button>
    </form>
  )
}

export const NewCard = memo(NewCardUnmemo)
