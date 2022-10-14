import VerifiedIcon from "public/icons/post-verified-small-icon.svg"
import React, { FC } from "react"

interface Props {
  contentAvatarDisplayName?: string
  contentAvatarUserName?: string
  imageSrc: string
  isOnline?: boolean
}

export const CompletedAvatar: FC<Props> = ({
  imageSrc,
  isOnline = false,
  contentAvatarDisplayName,
  contentAvatarUserName
}) => {
  return (
    <div className="flex w-full items-start pr-[10px]">
      <div className="flex items-center pb-[5px]">
        {isOnline && (
          <span className="bg-green absolute top-0.5 right-2 h-[15px] w-[15px] rounded-full bg-[#7AF086]" />
        )}
        <img
          width="37px"
          height="37px"
          className="rounded-full border-[1.5px] border-[#3E3E44]"
          src={imageSrc}
          alt="ProfilePhoto"
        />
      </div>

      <div className="flex flex-col items-start pl-3">
        <div className="flex items-center">
          <span className="text-[13px] font-medium leading-[17px] text-[#fff]">
            {contentAvatarDisplayName}
          </span>
          <div className="flex items-center gap-1 pl-1">
            <VerifiedIcon />
            <span className="text-[9.4px] font-medium leading-[11px] text-[#ffff]/50">
              Verified
            </span>
          </div>
        </div>
        <span className="text-[10px] font-medium leading-[17px] text-[#fff]/50">
          @{contentAvatarUserName}
        </span>
      </div>
    </div>
  )
}
