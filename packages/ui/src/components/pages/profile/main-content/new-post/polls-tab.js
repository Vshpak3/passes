import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import PollIcon from "public/icons/post-poll-icon.svg"
import React, { useEffect } from "react"
import { useFieldArray } from "react-hook-form"
import { FormInput } from "src/components/form/form-input"

const defaultValues = { value: "Answer" }

export const PollsTab = ({ control, register, onCloseTab }) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "pollOptions", // unique name for your Field Array
    defaultValues
  })
  const options = ["No Limit", "1 Day", "3 days", "7 Days", "10 Days"]

  useEffect(() => {
    if (fields.length === 0)
      append([
        { value: "Option 1" },
        { value: "Option 2" },
        { value: "Option 3" }
      ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

  return (
    <div className="mb-5 flex w-full flex-col items-start rounded-md bg-[#1b141d]/80 px-4 py-4 backdrop-blur-[10px]">
      <div className="-mt-[7px] flex w-full flex-wrap items-center justify-between pb-1">
        <div className="flex cursor-pointer items-center">
          <span className="pr-2">
            <PollIcon className="h-6 w-6" />
          </span>
          <span className="text-base font-medium  text-[#ffff]">Poll</span>
        </div>
        <div className="flex items-center">
          <span>
            <FormInput
              type="select"
              register={register}
              name="pollsExpire"
              placeholder="1 Day"
              className="box-border flex items-start justify-between gap-[10px] rounded-md border border-[#2C282D] bg-[#100C11]"
              selectOptions={options}
            />
          </span>
          <DeleteIcon className="" onClick={() => onCloseTab()} />
        </div>
      </div>
      <div className="flex w-full flex-col justify-start gap-1">
        {fields.map((index) => {
          return (
            <div key={index}>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <DeleteIcon className="" onClick={() => remove(index)} />
                </div>
                <FormInput
                  autoComplete="off"
                  register={register}
                  type="text"
                  name={`pollOptions.${index}.value`}
                  className="w-full rounded-md border-[#2C282D] bg-[#100C11] py-[10px] pl-4 text-base font-bold text-[#ffffff]/90 focus:border-[#2C282D] focus:ring-0"
                  placeholder="Type Option here.."
                />
              </div>
            </div>
          )
        })}
        <button
          type="button"
          onClick={() => append(defaultValues)}
          className=" flex cursor-pointer items-center justify-start pt-1 text-base text-[#bf7af0] hover:underline"
        >
          + Add another option
        </button>
      </div>
    </div>
  )
}
