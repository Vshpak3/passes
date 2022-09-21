import { yupResolver } from "@hookform/resolvers/yup"
import React from "react"
import { useForm } from "react-hook-form"
import { Alert, Button, ButtonTypeEnum, FormInput } from "src/components/atoms"
import { bankingSchema } from "src/helpers/validation"

const AddBankForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ resolver: yupResolver(bankingSchema) })
  // TODO above change validation

  const onSubmitBankAccount = (data: any) => {
    console.log(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitBankAccount)}
      className="mt-11 text-base font-medium text-passes-gray-200"
    >
      <label>
        <span>Type of Bank Account</span>
        <FormInput
          name="bankType"
          type="select"
          selectOptions={[{ label: "USA", value: "US" }]}
          className="mt-4 !border border-passes-dark-200 bg-passes-dark-700 !p-2.5 !text-base !text-white/[0.5] focus:!border-passes-secondary-color focus:ring-0"
          placeholder="Choose"
          register={register}
          errors={errors}
        />
      </label>

      <label className="mt-4 block">
        <span>Routing Number</span>
        <FormInput
          name="routingNumber"
          type="text"
          className="mt-2.5 !border border-passes-dark-200 bg-passes-dark-700 !p-2.5 !text-base placeholder:!text-white/[0.5] focus:!border-passes-secondary-color focus:ring-0"
          placeholder="4444 1902 0192 0100"
          register={register}
          errors={errors}
        />
      </label>

      <label className="mt-4 block">
        <span>Account Number</span>
        <FormInput
          name="accountNumber"
          type="text"
          className="mt-2.5 !border border-passes-dark-200 bg-passes-dark-700 !p-2.5 !text-base placeholder:!text-white/[0.5] focus:!border-passes-secondary-color focus:ring-0"
          placeholder="-"
          register={register}
          errors={errors}
        />
      </label>

      <h4 className="mt-4 text-lg font-bold leading-[25px] text-white">
        Billing address
      </h4>

      <FormInput
        name="billingAddress"
        type="text"
        className="mt-4 !border border-passes-dark-200 bg-passes-dark-700 !p-2.5 !text-base placeholder:!text-white/[0.5] focus:!border-passes-secondary-color focus:ring-0"
        placeholder="Address 1"
        register={register}
        errors={errors}
      />

      <FormInput
        name="alternativeAddress"
        type="text"
        className="mt-[25px] !border border-passes-dark-200 bg-passes-dark-700 !p-2.5 !text-base placeholder:!text-white/[0.5] focus:!border-passes-secondary-color focus:ring-0"
        placeholder="Address 2"
        register={register}
        errors={errors}
      />

      <FormInput
        name="country"
        type="select"
        selectOptions={[{ label: "USA", value: "US" }]}
        className="mt-[25px] !border border-passes-dark-200 bg-passes-dark-700 !p-2.5 !text-base !text-white/[0.5] focus:!border-passes-secondary-color focus:ring-0"
        placeholder="Country"
        register={register}
        errors={errors}
      />

      <FormInput
        name="city"
        type="text"
        className="mt-[25px] !border border-passes-dark-200 bg-passes-dark-700 !p-2.5 !text-base placeholder:!text-white/[0.5] focus:!border-passes-secondary-color focus:ring-0"
        placeholder="City"
        register={register}
        errors={errors}
      />

      <div className="mt-[25px] flex justify-between space-x-3">
        <div className="relative flex-1 flex-shrink-0">
          <FormInput
            name="district"
            type="text"
            className="!border border-passes-dark-200 bg-passes-dark-700 !p-2.5 !text-base placeholder:!text-white/[0.5] focus:!border-passes-secondary-color focus:ring-0"
            placeholder="State/District"
            register={register}
            errors={errors}
          />
          <Alert
            className="top-1/2 right-6 -translate-y-1/2"
            message="2 letter input only (Example: “FL”)"
          />
        </div>
        <div className="flex-1 flex-shrink-0">
          <FormInput
            name="postalCode"
            type="text"
            className="!border border-passes-dark-200 bg-passes-dark-700 !p-2.5 !text-base placeholder:!text-white/[0.5] focus:!border-passes-secondary-color focus:ring-0"
            placeholder="Zip"
            register={register}
            errors={errors}
          />
        </div>
      </div>

      <Button
        variant="pink"
        className="mt-[30px] !py-2.5"
        tag="button"
        type={ButtonTypeEnum.SUBMIT}
      >
        <span className="text-label">Confirm and Continue</span>
      </Button>
    </form>
  )
}

export default AddBankForm
