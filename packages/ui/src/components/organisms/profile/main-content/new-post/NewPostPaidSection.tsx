import { PassDto } from "@passes/api-client"
import { Dispatch, FC, SetStateAction, useCallback } from "react"
import { UseFormRegister } from "react-hook-form"

import { NumberInput } from "src/components/atoms/input/NumberInput"
import { Tag } from "src/components/atoms/Tag"
import { MAX_PAID_POST_PRICE } from "src/config/post"
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
          <span className="leading-[22px] text-[#FFFFFF]">
            These membership holders will be able to view your content for free
          </span>
          <PassesSearchBar
            onSelect={onPassSelect}
            selectedPassIds={selectedPasses.map((pass) => pass.passId)}
          />
        </div>
      </div>
      <div className="block w-full border-b border-passes-dark-200 p-0 pt-[38px] pb-7">
        <div className="flex items-center gap-1 pb-5 sm:gap-4">
          <span className="text-[#ffff]">
            Price (if not an above membership holder)
          </span>
          <div className="relative flex max-w-[140px] justify-between rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-base font-bold text-[#ffffff]/40">$</span>
            </div>
            <NumberInput
              className="min-h-[50px] w-full rounded-md border-passes-dark-200 bg-[#100C11] px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90"
              maxInput={MAX_PAID_POST_PRICE}
              name="price"
              register={register}
              type="currency"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-[6px] transition-all">
          {selectedPasses.map((pass: PassDto) => (
            <Tag
              key={pass.passId}
              onClick={() => removePass(pass.passId)}
              title={formatText(pass.title) as string}
            />
          ))}
        </div>
      </div>
    </>
  )
}
