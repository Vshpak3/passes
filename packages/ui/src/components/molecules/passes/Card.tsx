import { PassDto } from "@passes/api-client"
import React from "react"

import { useUser } from "../../../hooks"

interface IPassCardProps {
  pass: PassDto
}

const passType: Record<string, string> = {
  subscription: "Subscription Passes",
  lifetime: "Lifetime Pass",
  external: "External"
}

const Card: React.FC<IPassCardProps> = ({ pass }) => {
  const { user } = useUser()
  const isCreator = pass.creatorId === user?.id

  return (
    <div className="min-w-[218px] rounded-[20px] border border-passes-dark-200 bg-[#0E0A0F] px-5 py-4">
      <div className="h-[122px] rounded-[20px] bg-[#EBCFC2]" />
      <span className="mt-3 inline-block text-sm font-medium leading-4">
        {passType[pass.type] ?? pass.type}
      </span>
      <h2 className="mt-[3px] text-base font-bold leading-5">{pass.title}</h2>
      <p className="mt-2.5 text-xs font-medium leading-[18px] text-white/70">
        {pass.description}
      </p>
      <button className="mt-3 w-full rounded-[50px] bg-passes-primary-color py-2.5 text-center">
        {isCreator ? "Pin Pass" : "Purchase Pass"}
      </button>

      {isCreator && (
        <p className="mt-1.5 text-xs font-medium leading-[18px] text-white/70">
          *Pinned passes are shown on the right side of your profile page
        </p>
      )}

      <p className="mt-[14px] text-sm font-medium leading-[16px]">
        ${pass.price}
        <span className="text-xs font-normal leading-[23px] text-white/70">
          ({pass.remainingSupply} out of {pass.totalSupply} left)
        </span>
      </p>
    </div>
  )
}

export default Card
