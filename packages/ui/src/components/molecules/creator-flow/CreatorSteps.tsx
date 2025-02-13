import CheckIcon from "public/icons/check.svg"
import { FC } from "react"

import { CREATOR_STEPS_TEXT } from "src/config/creator-flow"

type CreatorStepsProps = {
  creatorStep: string
  isDone: boolean
  isSelected: boolean
}

export const CreatorSteps: FC<CreatorStepsProps> = ({
  creatorStep,
  isDone,
  isSelected
}) => {
  return (
    <>
      {/* small screens */}
      <div
        className={`flex flex-row items-center gap-3 rounded-full py-3 text-white md:hidden
        ${
          isSelected
            ? "flex-1 pl-6"
            : "h-12 w-12 shrink-0 items-center justify-center border border-gray-700 xs:aspect-1 xs:h-full xs:w-auto"
        }`}
      >
        <div className="bg-creator-flow-violet flex h-8 w-8 items-center justify-center rounded-full border border-gray-700">
          {isDone ? <CheckIcon /> : CREATOR_STEPS_TEXT[creatorStep].number}
        </div>
        <div className={`${isSelected ? "flex flex-1" : "hidden"} flex-col`}>
          <div className="flex w-full flex-1">
            {CREATOR_STEPS_TEXT[creatorStep].title}
          </div>
          <div className="text-slate-400">
            {CREATOR_STEPS_TEXT[creatorStep].subtitle}
          </div>
        </div>
      </div>
      {/* md and up Screen */}
      <div
        className={`hidden flex-1 flex-row items-center gap-3 rounded-full py-3 pl-6 text-white md:flex
        ${isSelected ? "border border-gray-700" : ""}`}
      >
        <div
          className={`h-8 w-8 rounded-full  ${
            isDone || isSelected
              ? "bg-creator-flow-violet"
              : "border border-gray-700"
          } flex items-center justify-center`}
        >
          {isDone ? <CheckIcon /> : CREATOR_STEPS_TEXT[creatorStep].number}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex w-full flex-1">
            {CREATOR_STEPS_TEXT[creatorStep].title}
          </div>
          <div className="text-slate-400">
            {CREATOR_STEPS_TEXT[creatorStep].subtitle}
          </div>
        </div>
      </div>
    </>
  )
}
