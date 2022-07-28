import FundraiserDollarIcon from "public/icons/fundraiser-dollar-icon.svg"
import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import FundraiserCoinIcon from "public/icons/post-fundraiser-coin-icon.svg"
import React, { useEffect } from "react"
import { useFieldArray } from "react-hook-form"
import { FormInput } from "src/components/form/form-input"

const defaultValues = { value: "0" }

export const NewFundraiserTab = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "fundraiserOptions", // unique name for your Field Array
    defaultValues
  })

  useEffect(() => {
    if (fields.length === 0)
      append([{ value: "10" }, { value: "25" }, { value: "50" }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

  return (
    <div className="mb-5 flex w-full flex-col items-start rounded-md bg-[#1b141d]/80 px-4 py-4 backdrop-blur-[10px]">
      <div className="flex w-full flex-wrap items-center justify-between">
        <div className="gap-[10px]py-[7px] flex cursor-pointer items-center px-[10px] pt-[5px] ">
          <span className="pr-2">
            <FundraiserCoinIcon />
          </span>
          <span className="text-base font-medium  text-[#ffff]">
            Fundraiser
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="pt-[5px]">Your Target</span>
          <div className="relative flex max-w-[140px] justify-between rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="pt-[5px] text-base font-bold text-[#ffffff]/40">
                <FundraiserDollarIcon />
              </span>
            </div>
            <FormInput
              register={register}
              type="number"
              name="price"
              className="w-full rounded-md border-[#2C282D]  bg-[#100C11] px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90 focus:border-[#2C282D] focus:ring-0 "
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col flex-wrap items-center justify-center gap-3 pt-5">
        <div className="flex flex-wrap items-center gap-12">
          {fields.map(({ id }, index) => (
            <div key={id} className="flex items-center">
              <div className="relative flex max-w-[90px] justify-between rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="pt-[5px] text-base font-bold text-[#ffffff]/40">
                    $
                  </span>
                </div>
                <FormInput
                  register={register}
                  type="number"
                  name={`fundraiserOptions.${index}.value`}
                  className="w-full rounded-md border-[#2C282D]  bg-[#100C11] px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90 focus:border-[#2C282D] focus:ring-0 "
                />
              </div>
              <span className="cursor-pointer pt-[5px]">
                {fields.length > 1 && (
                  <DeleteIcon onClick={() => remove(index)} />
                )}
              </span>
            </div>
          ))}
          <span className="flex w-[100px] items-center justify-center">
            <button
              type="button"
              onClick={() => append(defaultValues)}
              className="flex w-full items-center justify-center rounded-[56px] border-none bg-[#FFFEFF]/10 py-[10px] text-base font-semibold text-white shadow-sm hover:bg-[#bf7af0]/10 "
            >
              + Option
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
