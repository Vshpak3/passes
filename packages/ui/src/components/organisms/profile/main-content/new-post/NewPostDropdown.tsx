import { PassDto } from "@passes/api-client"
import AudienceChevronIcon from "public/icons/post-audience-chevron-icon.svg"
import AudienceIcon from "public/icons/post-audience-icon.svg"
import { FC } from "react"
import { UseFormRegister } from "react-hook-form"
import { FormInput } from "src/components/atoms/FormInput"
import { useCreatorPasses } from "src/hooks/useCreatorPasses"

interface NewPostDropdownProps {
  register: UseFormRegister<NewPostFormProps>
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void
  dropdownVisible: boolean
  setDropdownVisible: (value: boolean) => void
}

interface NewPostFormProps {
  expiresAt: Date | null
  isPaid: boolean
  mentions: any[] // TODO
  passes: PassDto[]
  price: string
  scheduledAt: Date | null
  text: string
}

export const NewPostDropdown: FC<NewPostDropdownProps> = ({
  register,
  onChange,
  dropdownVisible,
  setDropdownVisible
}) => {
  // TODO: add pagination here
  const { passes } = useCreatorPasses()

  return (
    <div className="relative flex cursor-pointer flex-col gap-4">
      <div
        className="box-border flex items-start justify-between gap-[10px] rounded-md border border-passes-dark-200 bg-[#100C11] p-[10px]"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <div className="flex items-center gap-[10px] ">
          <AudienceIcon />
          <span className="text-base font-bold text-[#FFFFFF]/90">
            Select Pass
          </span>
        </div>
        <AudienceChevronIcon className="ml-[77px]" />
      </div>
      {dropdownVisible && (
        <fieldset className="absolute top-14 box-border flex w-full flex-col items-start justify-start gap-[10px] rounded-md border border-passes-dark-200 bg-[#100C11] p-[10px]">
          {passes && passes.length > 0
            ? passes.map(({ passId, title }: PassDto) => (
                <div key={passId}>
                  <FormInput
                    register={register}
                    name={passId}
                    type="checkbox"
                    options={{ onChange }}
                    label={title}
                    className="h-4 w-4 rounded border border-[#D0D5DD] bg-transparent text-passes-primary-color ring-0 focus:shadow-none focus:ring-0 focus:ring-offset-0"
                  />
                </div>
              ))
            : "No passes"}
        </fieldset>
      )}
    </div>
  )
}
