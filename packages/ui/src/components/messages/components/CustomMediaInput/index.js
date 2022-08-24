import Recorder from "public/icons/media-recorder.svg"
import VaultIcon from "public/icons/messages-vault-icon.svg"
import PaidIcon from "public/icons/paid-content-icon.svg"
import Photos from "public/icons/profile-photos1-icon.svg"
import React from "react"
import { classNames } from "src/helpers"

const mediaTypes = [
  {
    name: "Media",
    Icon: Photos,
    accept: [".png", ".jpg", ".jpeg", ".mp4", ".mov", ".qt", ".mp3"],
    multiple: true,
    type: "button"
  },
  {
    name: "Video",
    Icon: Recorder,
    accept: [".mp4", ".mov", ".qt"],
    type: "button"
  },
  {
    name: "Vault",
    Icon: VaultIcon,
    accept: [".mp4", ".mov", ".qt"],
    type: "button"
  },
  {
    name: "Message Price",
    Icon: PaidIcon,
    accept: [".mp4", ".mov", ".qt"],
    type: "button"
  }
]
export const CustomMediaInput = ({ activeMedia, onMediaChange }) => {
  return (
    <div className="flex items-center justify-start">
      {mediaTypes.map(({ name, Icon, type }) => (
        <button
          key={name}
          type={type}
          className={classNames(
            activeMedia === name
              ? " bg-[rgba(191,122,240,0.1)] "
              : "hover:bg-[rgba(191,122,240,0.1)]",
            "group flex flex-shrink-0 items-center rounded-[56px] px-4 py-3 text-sm leading-4 text-[#BF7AF0]"
          )}
          onClick={() => onMediaChange(name)}
        >
          <span className="flex flex-shrink-0 cursor-pointer items-center gap-1">
            <Icon className="flex flex-shrink-0" />
            <span
              className={classNames(
                activeMedia === name ? "block" : "hidden group-hover:block",
                "block"
              )}
            >
              {name}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}
