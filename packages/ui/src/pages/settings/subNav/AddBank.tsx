import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import BackArrowIcon from "public/icons/back-arrow.svg"
import InfoIcon from "public/icons/info-icon.svg"
import EditIcon from "public/icons/profile-edit-icon.svg"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { COUNTRIES } from "src/helpers/countries"

import { PaymentAndWalletSettingsEnum } from "./PaymentAndWalletSettings"

interface PaymentSettingsProps {
  setSettingsNav: Dispatch<SetStateAction<string>>
}

const AddBank = ({ setSettingsNav }: PaymentSettingsProps) => {
  const {
    register,
    formState: { errors }
  } = useForm()
  return (
    <>
      <div
        onClick={() => setSettingsNav(PaymentAndWalletSettingsEnum.MANAGE_BANK)}
        className="mb-5 flex w-[700px] cursor-pointer flex-row items-center justify-between border-b border-[#2C282D] pb-5"
      >
        <div className="flex items-center justify-center gap-4">
          <BackArrowIcon />
          <span className="text-[20px] font-[700]">Manage Bank</span>
        </div>
      </div>
      <span className="text-[16px] font-[500] opacity-50">
        Banking information
      </span>
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-[500]">To download W9 form</span>
        <button
          className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 text-white"
          onClick={() => console.log}
        >
          <span className="text-[16px] font-[500]">Download W9 Form</span>
        </button>
      </div>
      <div className="mt-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-[500]">To edit W9 form</span>
          <div
            className="tooltip"
            data-tip="Please, mannually fill out the W9 Form, and upload filled out W9 Form here."
          >
            <InfoIcon />
          </div>
        </div>
        <button
          className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 text-white"
          onClick={() => console.log}
        >
          <EditIcon />
          <span className="text-[16px] font-[500]">Edit W9 Form</span>
        </button>
      </div>
      <span className="text-[16px] font-[500] text-[#767676]">
        Type of Bank Account
      </span>
      <FormInput
        register={register}
        type="select"
        selectOptions={[]}
        name="bankAccountType"
        placeholder="Choose"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-200 bg-transparent"
      />
      <span className="text-[16px] font-[500] text-[#767676]">
        Routing Number
      </span>
      <FormInput
        register={register}
        type="text"
        name="routingNumber"
        placeholder="4444 1902 0192 0100"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-200 bg-transparent"
      />
      <span className="text-[16px] font-[500] text-[#767676]">
        Account Number
      </span>
      <FormInput
        register={register}
        type="text"
        name="accountNumber"
        placeholder="-"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-200 bg-transparent"
      />
      <span className="text-[16px] font-[500]">Billing address</span>
      <FormInput
        register={register}
        type="text"
        name="address1"
        placeholder="Address 1"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-200 bg-transparent"
      />
      <FormInput
        register={register}
        type="text"
        name="address2"
        placeholder="Address 2"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-200 bg-transparent"
      />
      <FormInput
        register={register}
        type="select"
        selectOptions={COUNTRIES}
        name="country"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-200 bg-transparent"
      />
      <FormInput
        register={register}
        type="text"
        name="city"
        placeholder="City"
        errors={errors}
        className="mt-2 mb-4 border-passes-dark-200 bg-transparent"
      />
      <div className="flex gap-4">
        <FormInput
          register={register}
          type="text"
          name="stateDistrict"
          placeholder="State/District"
          icon={
            <div
              className="tooltip absolute left-[310px] top-[26px] h-4 w-4"
              data-tip="2 letter input only (Example: “FL”)"
            >
              <InfoIcon />
            </div>
          }
          errors={errors}
          className="mt-2 mb-4 border-passes-dark-200 bg-transparent"
        />

        <FormInput
          register={register}
          type="text"
          name="zip"
          placeholder="Zip"
          errors={errors}
          className="mt-2 mb-4 border-passes-dark-200 bg-transparent"
        />
      </div>
      <button
        className="flex h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-full border border-passes-pink-100 bg-passes-pink-100 px-2 text-white"
        onClick={console.log}
      >
        <span className="text-[16px] font-[500]">Confirm and Continue</span>
      </button>
    </>
  )
}

export default AddBank
