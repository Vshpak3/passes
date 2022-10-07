import Image from "next/image"
import ChevronDown from "public/icons/sidebar-chevron-down-icon.svg"
import React from "react"

type Props = {
  nftPass?: any
}

const ProfileNFtPass = ({ nftPass }: Props) => (
  <div className="mb-5 w-[324px] rounded-[42px] bg-[conic-gradient(from_176.48deg_at_50%_52.18%,_#007888_0deg,_#00278A_48.75deg,_#340077_136.88deg,_#A83C00_206.25deg,_#A4A400_271.87deg,_#007888_360deg)] p-3">
    <div className="flex flex-col rounded-[31.5px] bg-[#2e2e2e]/80">
      <div>
        <Image width="301" height="274" alt="" src={nftPass.logoUrl || ""} />
      </div>
      <div className="flex flex-col justify-center pt-5 text-center">
        <div>
          <span className="text-3xl font-semibold tracking-tighter text-white">
            {nftPass.name}
          </span>
        </div>
        <div className="flex justify-center gap-3 pt-3 pb-6 text-[10px]">
          <span className="flex items-center gap-1">
            <span>About</span>
            <span>
              <ChevronDown />
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span>Properties</span>
            <span>
              <ChevronDown />
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span>Details</span>
            <span>
              <ChevronDown />
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
)

export default ProfileNFtPass
