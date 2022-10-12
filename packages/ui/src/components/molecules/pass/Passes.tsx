import { PassDto } from "@passes/api-client"
import React, { FC } from "react"
import { PassTile } from "src/components/molecules/pass/PassTile"

interface PassesProps {
  passes: PassDto[]
  title: any
}

export const Passes: FC<PassesProps> = ({ passes, title }) => {
  const renderPassesGrid = passes?.map((pass: any, index: any) => (
    <PassTile key={index} pass={pass} />
  ))

  return (
    <>
      <div className="mt-4 mb-2 flex gap-x-4">
        <span className="text-[24px] font-bold text-[#ffff]/90">{title}</span>
        <hr className="my-auto grow border-passes-dark-200" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 sidebar-collapse:grid-cols-3">
        {renderPassesGrid}
      </div>
    </>
  )
}
