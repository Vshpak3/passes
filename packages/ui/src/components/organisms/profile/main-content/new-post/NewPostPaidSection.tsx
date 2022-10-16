import AudienceChevronIcon from "public/icons/post-audience-icon.svg"
import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import { Dispatch, FC, SetStateAction } from "react"
import { UseFormRegister } from "react-hook-form"
import { FormInput } from "src/components/atoms/FormInput"

import { NewPostFormProps } from "./NewPost"
import { NewPostPassesDropdown } from "./NewPostPassesDropdown"

interface NewPostPaidSectionProps {
  register: UseFormRegister<NewPostFormProps>
  selectedPasses: string[]
  setSelectedPasses: Dispatch<SetStateAction<string[]>>
}

export const NewPostPaidSection: FC<NewPostPaidSectionProps> = ({
  register,
  selectedPasses,
  setSelectedPasses
}) => {
  const onPassSelect = (pass: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPasses([...selectedPasses, pass.target.name])
  }

  const removePasses = (idToRemove: string) => {
    setSelectedPasses(selectedPasses.filter((passId) => passId !== idToRemove))
  }

  return (
    <>
      <div className="flex w-full flex-col items-start gap-[17px] border-b border-passes-dark-200 p-0 pt-[53px] pb-[56px] ">
        <span className="text-base font-normal text-passes-secondary-color">
          Who&apos;s is this content for?
        </span>
        <div className="flex flex-col items-start gap-[15px]">
          <span className="text-small leading-[22px] text-[#FFFFFF] ">
            These pass holders will be able to view your content for free
          </span>
          <NewPostPassesDropdown register={register} onChange={onPassSelect} />
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              min="1"
              max="5000"
              name="price"
              className="w-full rounded-md border-passes-dark-200 bg-[#100C11] px-[18px] py-[10px] text-right text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0 "
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-[6px] transition-all">
          {selectedPasses.map((pass: any, index: any) => (
            <div
              key={index}
              className="flex flex-shrink-0 animate-fade-in-down items-start gap-[10px] rounded-[56px] border border-passes-dark-200 bg-[#100C11] py-[10px] px-[18px]"
            >
              <span>
                <AudienceChevronIcon />
              </span>
              <span>{pass.title}</span>
              <span>
                <DeleteIcon onClick={() => removePasses(pass.id)} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
