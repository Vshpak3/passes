import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import PollIcon from "public/icons/post-poll-icon.svg"
import DeleteIconSmall from "public/icons/post-x-icon-small.svg"
import { FC, useEffect } from "react"
import { useFieldArray } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { Card } from "src/components/molecules"
interface PollsTabProps {
  control: any
  register: any
  onCloseTab: any
}

export const PollsTab: FC<PollsTabProps> = ({
  control,
  register,
  onCloseTab
}) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "pollOptions" // unique name for your Field Array
  })
  const options = ["1 Day", "3 days", "7 Days", "10 Days", "No Limit"]

  useEffect(() => {
    if (fields.length === 0) {
      append([
        { value: "Option 1" },
        { value: "Option 2" },
        { value: "Option 3" }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

  // const moveCard = useCallback((dragIndex: any, hoverIndex: any) => {
  //   move(dragIndex, hoverIndex)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  const renderCard = (field: any, index: any) => {
    return (
      <Card key={field.id}>
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <DeleteIconSmall className="" onClick={() => remove(index)} />
          </div>
          <FormInput
            register={register}
            type="text"
            name={`pollOptions.${index}.value`}
            className="w-full rounded-md border-passes-dark-200 bg-[#100C11] py-[10px] text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0 sm:pl-6"
            placeholder="Type option here."
          />
        </div>
      </Card>
    )
  }

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
              className="box-border flex items-start justify-between rounded-md border border-passes-dark-200 bg-[#100C11]  focus:border-passes-dark-200 focus:ring-0"
              selectOptions={options}
            />
          </span>
          <DeleteIcon className="" onClick={() => onCloseTab("Polls")} />
        </div>
      </div>
      <div className="flex w-full flex-col justify-start gap-1">
        {fields.map((field, index) => renderCard(field, index))}
        <button
          type="button"
          onClick={() => append({ value: "Answer" })}
          className=" flex cursor-pointer items-center justify-start pt-1 text-base text-passes-secondary-color hover:underline"
        >
          + Add another option
        </button>
      </div>
    </div>
  )
}
