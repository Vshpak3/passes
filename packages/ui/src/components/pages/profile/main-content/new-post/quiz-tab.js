import DeleteIcon from "public/icons/post-audience-x-icon.svg"
import CheckIcon from "public/icons/post-quiz-check-icon.svg"
import WhiteQuizIcon from "public/icons/post-quiz-white-icon.svg"
import WrongIcon from "public/icons/post-quiz-x-icon.svg"
import DeleteIconSmall from "public/icons/post-x-icon-small.svg"
import React, { useCallback, useEffect } from "react"
import { useFieldArray } from "react-hook-form"
import { FormInput } from "src/components/atoms"
import { Card } from "src/components/molecules"

const defaultValues = { value: "Answer", isTrue: false }

export const NewsQuizTab = ({ control, register, onCloseTab }) => {
  const { fields, append, remove, replace, move } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "quizOptions", // unique name for your Field Array
    defaultValues
  })
  const options = ["1 Day", "3 days", "7 Days", "10 Days", "No Limit"]

  useEffect(() => {
    if (fields.length === 0)
      append([
        { value: "Answer 1", isTrue: true },
        { value: "Answer 2", isTrue: false },
        { value: "Answer 3", isTrue: false }
      ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])

  const onChangeCorrectAnswer = (index) => {
    replace(
      fields.map((field, i) =>
        i === index ? { ...field, isTrue: true } : { ...field, isTrue: false }
      )
    )
  }

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    move(dragIndex, hoverIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const renderCard = (field, index) => {
    return (
      <Card key={field.id} index={index} id={field.id} moveCard={moveCard}>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 right-0 flex  flex-shrink-0 items-center  pr-3">
            <DeleteIconSmall className="" onClick={() => remove(index)} />
          </div>
          <FormInput
            autoComplete="off"
            register={register}
            type="text"
            name={`quizOptions.${index}.value`}
            className="w-full rounded-md border-passes-dark-200 bg-[#100C11] py-[10px]  text-base font-bold text-[#ffffff]/90 focus:border-passes-dark-200 focus:ring-0"
            placeholder="Type an answer here."
            icon={
              <div
                className="items-center pl-2 pt-[1px]"
                onClick={() => onChangeCorrectAnswer(index)}
              >
                <span className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-passes-secondary-color">
                  {field.isTrue ? (
                    <CheckIcon className="h-3 w-3" />
                  ) : (
                    <WrongIcon className="h-3 w-3" />
                  )}
                </span>
              </div>
            }
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
            <WhiteQuizIcon className="h-6 w-6" />
          </span>
          <span className="text-base font-medium  text-[#ffff]">Quiz</span>
        </div>
        <div className="flex items-center">
          <span>
            <FormInput
              type="select"
              register={register}
              name="quizExpire"
              className="box-border flex items-start justify-between rounded-md border border-passes-dark-200 bg-[#100C11]  focus:border-passes-dark-200 focus:ring-0"
              selectOptions={options}
            />
          </span>
          <DeleteIcon className="" onClick={() => onCloseTab("Quiz")} />
        </div>
      </div>
      <div className="flex w-full flex-col justify-start gap-1">
        {fields.map((field, index) => renderCard(field, index))}
        <button
          type="button"
          onClick={() => append(defaultValues)}
          className=" flex cursor-pointer items-center justify-start pt-1 text-base text-passes-secondary-color hover:underline"
        >
          + Add another option
        </button>
      </div>
      {/* <Container  /> */}
    </div>
  )
}
