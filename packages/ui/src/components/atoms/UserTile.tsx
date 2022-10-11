import Image from "next/image"
import VerifiedIcon from "public/icons/post-verified-small-icon.svg"
import React from "react"

export const UserTile = () => {
  return (
    <div className="p-2">
      <div className="flex items-center space-x-[3px]">
        <VerifiedIcon />
        <span className="text-[9px] font-medium leading-[11px]">Verified</span>
      </div>

      <div className="mt-1 flex flex-col items-center">
        <span className="relative h-[55px] w-[55px] rounded-full">
          <Image
            src="/img/tiles/profile-lucy-guo.png"
            layout="fill"
            alt="user profile img"
            objectFit="cover"
            objectPosition="center"
          />
        </span>
        <p className="mt-[5px] text-[9px] font-medium leading-[11px]">
          Lucy Guo
        </p>
        <span className="mt-[3px] rounded-full bg-[linear-gradient(133.67deg,#D6409F_-2.38%,#AB4ABA_49.91%,#8E4EC6_100.06%)] py-1.5 px-3 text-[9px] leading-[9px]">
          @guo
        </span>
      </div>
    </div>
  )
}
