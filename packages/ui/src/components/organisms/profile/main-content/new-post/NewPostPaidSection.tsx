import { PassDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback } from "react"
import { UseFormRegister } from "react-hook-form"

import { FormInput } from "src/components/atoms/FormInput"
import { Tag } from "src/components/atoms/Tag"
import { formatText } from "src/helpers/formatters"
import { NewPostFormProps } from "./NewPostEditor"
import { PassesSearchBar } from "./PassesSearchBar"

interface NewPostPaidSectionProps {
  register: UseFormRegister<NewPostFormProps>
  selectedPasses: PassDto[]
  setSelectedPasses: Dispatch<SetStateAction<PassDto[]>>
}

export const NewPostPaidSection: FC<NewPostPaidSectionProps> = ({
  register,
  selectedPasses,
  setSelectedPasses
}) => {
  const onPassSelect = useCallback(
    (pass: PassDto) => {
      setSelectedPasses((state) => [...state, pass])
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const removePass = useCallback(
    (idToRemove: string) => {
      setSelectedPasses((state) =>
        state.filter((pass) => pass.passId !== idToRemove)
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <>
      <div className="flex w-full flex-col items-start gap-[17px] border-b border-passes-dark-200 p-0 pt-[53px] pb-[56px]">
        <span className="text-base font-normal text-passes-secondary-color">
          Who is this content for?
        </span>
        <div className="flex flex-col items-start gap-[15px]">
          <span className="text-small leading-[22px] text-[#FFFFFF]">
            These pass holders will be able to view your content for free
          </span>
          <PassesSearchBar
            selectedPassIds={selectedPasses.map((pass) => pass.passId)}
            onSelect={onPassSelect}
          />
        </div>
      </div>
      <div className="block w-full border-b border-passes-dark-200 p-0 pt-[38px] pb-7">
        <div className="flex flex-1 items-center gap-1 pb-5 sm:gap-4">
          <span className="text-xs text-[#ffff] sm:text-base">
            Price (if not an above pass holder)
          </span>
          <div className="relative flex max-w-[140px] justify-between rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-base font-bold text-[#ffffff]/40">$</span>
            </div>
            <FormInput
              register={register}
              type="number"
              name="price"
              className="w-full rounded-md border-passes-dark-200 bg-[#100C11] px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0 "
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-[6px] transition-all">
          {selectedPasses.map((pass: any) => (
            <Tag
              key={pass.passId}
              title={formatText(pass.title) as string}
              onClick={() => removePass(pass.passId)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
