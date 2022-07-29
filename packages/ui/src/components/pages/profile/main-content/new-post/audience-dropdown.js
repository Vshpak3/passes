import AudienceChevronIcon from "public/icons/post-audience-chevron-icon.svg"
import AudienceIcon from "public/icons/post-audience-icon.svg"
import React from "react"
import { FormInput } from "src/components/form/form-input"

export const NewPostDropdown = ({
  register,
  passes,
  onChange,
  dropdownVisible,
  setDropdownVisible
}) => {
  return (
    <div className="relative flex cursor-pointer flex-col gap-4">
      <div
        className="box-border flex items-start justify-between gap-[10px] rounded-md border border-[#2C282D] bg-[#100C11] p-[10px]"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <div className="flex items-center gap-[10px] ">
          <AudienceIcon />
          <span className="text-base font-bold text-[#FFFFFF]/90">
            Select Audience
          </span>
        </div>
        <AudienceChevronIcon className="ml-[77px]" />
      </div>
      {dropdownVisible && (
        <fieldset className="absolute top-14 box-border flex w-full flex-col items-start justify-start gap-[10px] rounded-md border border-[#2C282D] bg-[#100C11] p-[10px]">
          {passes &&
            passes.map((pass) => (
              <div key={`passes.${pass.id}`}>
                <FormInput
                  register={register}
                  name={`passes[${pass.id}]`}
                  type="checkbox"
                  options={{ onChange }}
                  label={pass.title}
                  className="h-4 w-4 rounded border border-[#D0D5DD] bg-transparent text-[#9C4DC1] ring-0 focus:shadow-none focus:ring-0 focus:ring-offset-0"
                />
              </div>
            ))}
        </fieldset>
      )}
    </div>
  )
}
