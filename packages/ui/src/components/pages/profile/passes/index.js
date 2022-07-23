import React from "react"

import Carousel from "./Carousel"
import { Pass } from "./PassesComponents"

const Passes = ({ profile }) => (
  <div className="flex flex-col items-center rounded-[20px] border border-[#ffffff]/10 bg-[#1b141d]/50 px-[17px] py-[22px] pt-[19px] backdrop-blur-[100px]  md:items-center ">
    <span className="text-base font-bold text-[#ffff]/90 lg:self-start">
      Pass Types
    </span>
    <div>
      <div className="lg:overflow-x-none hidden gap-3 lg:mx-0 lg:flex lg:flex-col lg:items-start lg:divide-y lg:divide-[#322E33]">
        {profile.passes?.map((pass, index) => (
          <Pass key={index} pass={pass} />
        ))}
      </div>
      <div className="-ml-[12px] -mr-[12px] lg:hidden">
        {profile.passes && <Carousel passes={profile.passes} />}
      </div>
    </div>
  </div>
)

export default Passes
