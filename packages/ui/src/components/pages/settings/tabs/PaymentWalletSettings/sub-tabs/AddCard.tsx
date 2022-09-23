import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { Menu, Transition } from "@headlessui/react"
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
import MetamaskIcon from "public/icons/metamask-icon.svg"
import PhantomIcon from "public/icons/phantom-icon.svg"
import VisaIcon from "public/icons/visa-icon.svg"
import { Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { FormInput, PassesPinkButton } from "src/components/atoms"
import { COUNTRIES } from "src/helpers/countries"
import encrypt from "src/helpers/openpgp"
import { useUser } from "src/hooks"
import ChevronDown from "src/icons/chevron-down"
import { v4 } from "uuid"

import { SubTabsEnum } from "../../../../../../config/settings"
import {
  ISettingsContext,
  useSettings
} from "../../../../../../contexts/settings"
import Tab from "../../../Tab"

const AddCard = () => {
  const { addTabToStackHandler } = useSettings() as ISettingsContext
  const [phantomActive, setPhantomActive] = useState(false)
  const [metamaskActive, setMetamaskActive] = useState(false)
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
            name: user?.legalFullName ?? "",
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
      console.log(payload, "payload")

      const paymentApi = new PaymentApi()
      await paymentApi.createCircleCard({
        circleCreateCardAndExtraRequestDto: payload
      })
    } catch (error: any) {
      toast.error(error)
    } finally {
      addTabToStackHandler(SubTabsEnum.ManageCard)
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
      <Tab withBack title="Add New Payment Method" />

      <span className="text-[24px] font-[700]">Use Crypto</span>
      <div className="my-4 flex flex-row gap-4">
        <div
          onClick={() => setMetamaskActive(!metamaskActive)}
          className="flex cursor-pointer flex-row items-center gap-2"
        >
          <MetamaskIcon
            className={metamaskActive ? "stroke-passes-pink-100 stroke-2" : ""}
          />
          <span className="text-[20px] font-[700]">Metamask</span>
        </div>

        <div
          onClick={() => setPhantomActive(!phantomActive)}
          className="flex cursor-pointer flex-row items-center gap-2"
        >
          <PhantomIcon
            className={phantomActive ? "stroke-passes-pink-100 stroke-2" : ""}
          />
          <span className="text-[20px] font-[700]">Phantom</span>
        </div>
      </div>
      <div className="flex flex-row gap-6">
        {metamaskActive && (
          <div
            className={
              (metamaskActive ? "flex" : "hidden") +
              " h-[72px] items-center justify-center text-[#B8B8B8]"
            }
          >
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button>
                <div className="flex h-[45px] cursor-pointer flex-row items-center gap-4 rounded-[6px] border border-passes-dark-100 bg-transparent p-4 text-[#ffff]/90">
                  <span className="text-[16px] font-[400] opacity-[0.5]">
                    Select Type
                  </span>
                  <ChevronDown />
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="absolute right-0 z-10 mt-2 flex origin-top-right flex-col justify-center gap-4 rounded-[20px] border border-passes-dark-100 bg-black p-5 text-center shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-[12px] font-[400] text-[#979797]">
                      USDC (ETH, AVAX, POLYGON)
                    </span>
                    <FormInput
                      register={register}
                      type="checkbox"
                      name="nftMintingCheckbox"
                      errors={errors}
                      className="h-[20px] w-[20px] cursor-pointer bg-transparent"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-[12px] font-[400] text-[#979797]">
                      Native ETH
                    </span>
                    <FormInput
                      register={register}
                      type="checkbox"
                      name="nftMintingCheckbox"
                      errors={errors}
                      className="h-[20px] w-[20px] cursor-pointer bg-transparent"
                    />
                  </div>
                  <PassesPinkButton
                    className="mt-4 w-[223px]"
                    name="Save"
                    onClick={console.log}
                  />
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        )}

        {phantomActive && (
          <div
            className={
              (phantomActive ? " flex " : " hidden ") +
              (metamaskActive ? "" : " ml-[43%] ") +
              " h-[72px] items-center justify-center text-[#B8B8B8]"
            }
          >
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button>
                <div className="flex h-[45px] cursor-pointer flex-row items-center gap-4 rounded-[6px] border border-passes-dark-100 bg-transparent p-4 text-[#ffff]/90">
                  <span className="text-[16px] font-[400] opacity-[0.5]">
                    Select Type
                  </span>
                  <ChevronDown />
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="absolute right-0 z-10 mt-2 flex origin-top-right flex-col justify-center gap-4 rounded-[20px] border border-passes-dark-100 bg-black p-5 text-center shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-[12px] font-[400] text-[#979797]">
                      USDC
                    </span>
                    <FormInput
                      register={register}
                      type="checkbox"
                      name="nftMintingCheckbox"
                      errors={errors}
                      className="h-[20px] w-[20px] cursor-pointer bg-transparent"
                    />
                  </div>
                  <PassesPinkButton
                    className="mt-4 w-[223px]"
                    name="Save"
                    onClick={console.log}
                  />
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        )}
      </div>
      <div className="mb-4 flex flex-col gap-6">
        <span className="text-[20px] font-[700]">or</span>
        <span className="text-[24px] font-[700]">Add New Card</span>
      </div>
      <span className="text-[16px] font-[500] text-[#767676]">Card Info</span>
      <FormInput
        register={register}
        type="text"
        name="card-number"
        placeholder="4444 1902 0192 0100"
        errors={errors}
        options={{
          required: { message: "Card number is required", value: true },
          pattern: { message: "must be card number", value: /\d{16}/ }
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
