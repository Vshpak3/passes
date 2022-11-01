import { PassDto } from "@passes/api-client"
import React, { FC } from "react"

import { PassTile } from "src/components/molecules/pass/PassTile"

interface PassesProps {
  passes: PassDto[]
  title: string
}

// Might be used in the future
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Passes: FC<PassesProps> = ({ passes, title }) => {
  const renderPassesGrid = passes?.map((pass: PassDto, index: number) => (
    <PassTile key={index} pass={pass} />
  ))

  return (
    <>
      <div className="mt-4 mb-2 flex gap-x-4">
        <span className="text-[24px] font-bold text-[#ffff]/90">{title}</span>
        <hr className="my-auto grow border-passes-dark-200" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {renderPassesGrid}
      </div>
    </>
  )
}
