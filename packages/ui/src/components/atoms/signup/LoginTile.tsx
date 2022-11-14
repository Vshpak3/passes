import classNames from "classnames"
import Image from "next/image"
import VerifiedIcon from "public/icons/post-verified-small-icon.svg"
import React, { FC } from "react"

interface LoginTileProps {
  name: string
  username: string
  filename: string
  hidden: boolean
  setLoaded: () => void
}

export const LoginTile: FC<LoginTileProps> = ({
  name,
  username,
  filename,
  hidden,
  setLoaded
}) => {
  return (
    <div className={classNames("p-2", { hidden })}>
      <div className="flex items-center space-x-[3px]">
        <VerifiedIcon />
        <span className="text-[9px] font-medium leading-[11px]">Verified</span>
      </div>

      <div className="mt-1 flex flex-col items-center">
        <span className="relative h-[55px] w-[55px] rounded-full">
          <Image
            alt={name}
            height="65"
            onLoad={setLoaded}
            src={filename}
            width="65"
          />
        </span>
        <p className="mt-[5px] text-[9px] font-medium leading-[11px]">{name}</p>
        <span className="mt-[3px] rounded-full bg-[linear-gradient(133.67deg,#D6409F_-2.38%,#AB4ABA_49.91%,#8E4EC6_100.06%)] py-1.5 px-3 text-[9px] leading-[9px]">
          @{username}
        </span>
      </div>
    </div>
  )
}
