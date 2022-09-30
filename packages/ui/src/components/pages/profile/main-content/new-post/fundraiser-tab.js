import FundraiserDollarIcon from "public/icons/fundraiser-dollar-icon.svg"
import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import FundraiserWhiteIcon from "public/icons/post-fundraiser-white-icon.svg"
import React, { useEffect, useState } from "react"
import { useFieldArray } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { classNames, formatCurrency } from "src/helpers"

const defaultValues = { value: "0" }

export const NewFundraiserTab = ({
  control,
  register,
  fundraiserTarget,
  onCloseTab
}) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "fundraiserOptions", // unique name for your Field Array
    defaultValues
  })
  const [targetAcquired, setTargetAcquired] = useState(false)

  useEffect(() => {
    if (fields.length === 0) {
      append([{ value: "10" }, { value: "25" }, { value: "50" }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

  return (
    <div className="mb-5 flex w-full flex-col items-start rounded-md bg-[#1b141d]/80 px-4 py-4 backdrop-blur-[10px]">
      <div className="flex w-full flex-wrap items-center justify-between pb-1">
        <div className="flex cursor-pointer items-center">
          <span className="pr-2">
            <FundraiserWhiteIcon className="h-6 w-6" />
          </span>
          <span className="text-base font-medium  text-[#ffff]">
            Fundraiser
          </span>
        </div>
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => setTargetAcquired(!targetAcquired)}
        >
          {targetAcquired && (
            <span className="text-base font-medium  text-[#ffff]">
              Target {formatCurrency(fundraiserTarget)}
            </span>
          )}
          <DeleteIcon className="" onClick={() => onCloseTab("Fundraiser")} />
        </div>
      </div>
      {targetAcquired ? (
        <div className="flex w-full flex-col justify-start gap-1">
          {fields.map((field, index) => {
            return (
              <div key={index}>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <DeleteIcon className="" onClick={() => remove(index)} />
                  </div>
                  <FormInput
                    autoComplete="off"
                    register={register}
                    type="text"
                    name={`fundraiserOptions.${index}.value`}
                    className="w-full rounded-md border-passes-dark-200 bg-[#100C11] pl-4 text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0 "
                  />
                </div>
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => append(defaultValues)}
            className=" flex cursor-pointer items-center justify-start pt-1 text-base text-passes-secondary-color hover:underline"
          >
            + Add another option
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-[#ffffff]/40">
              <FundraiserDollarIcon />
            </span>
            <span>Fundraiser Target</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className=" flex w-full items-center justify-center rounded-md shadow-sm">
              <FormInput
                autoComplete="off"
                register={register}
                type="text"
                name="fundraiserTarget"
                placeholder="Minimum $10"
                className="w-full rounded-md border-passes-dark-200 bg-[#100C11]  pl-4 text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0 "
              />
            </div>

            <div className="flex items-center">
              <button
                className={classNames(
                  !(fundraiserTarget > 10) ? "opacity-50" : "",
                  "rounded-full bg-passes-secondary-color py-2 px-6"
                )}
                type="button"
                disabled={!(fundraiserTarget > 10)}
                onClick={() => setTargetAcquired(!targetAcquired)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
