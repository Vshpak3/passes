import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

import { PassDto } from "@passes/api-client"
import { FC } from "react"
import { ProfilePassCard } from "src/components/molecules/pass/ProfilePassCard"

interface PassesProps {} // eslint-disable-line @typescript-eslint/no-empty-interface

export const PassTypes: FC<PassesProps> = () => {
  const creatorPasses: PassDto[] = []

  return (
    <div className="hidden items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px] lg:m-0 lg:flex lg:flex-col lg:items-center">
      <span className="mb-5 text-base font-bold text-[#ffff]/90 lg:mb-0 lg:self-start">
        Pass Types
      </span>
      <div className="overflow-x-none relative mx-0 mt-4 flex flex-col items-start">
        {/* eslint-disable-next-line sonarjs/no-empty-collection */}
        {creatorPasses?.map((pass, index) => (
          <ProfilePassCard pass={pass} key={index} />
        ))}
      </div>
    </div>
  )
}
