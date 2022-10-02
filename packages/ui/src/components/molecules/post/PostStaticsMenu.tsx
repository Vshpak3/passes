import ArrowUpRight from "public/icons/arrow-up-right.svg"
import DollarGrayIcon from "public/icons/dollar-gray.svg"
import HeartIcon from "public/icons/heart-gray.svg"
import MessageIcon from "public/icons/message-dots-square.svg"
import CloseIcon from "public/icons/sidebar-close-icon.svg"
import TipsIcon from "public/icons/tips.svg"
import React, { useRef } from "react"
import { useOnClickOutside } from "src/hooks"

interface IPostStaticsMenu {
  onClose: () => void
}

const PostStaticsMenu: React.FC<IPostStaticsMenu> = ({ onClose }) => {
  const menuEl = useRef(null)

  useOnClickOutside(menuEl, onClose)

  return (
    <div
      ref={menuEl}
      className="absolute top-full right-0 z-50 min-w-[325px] translate-y-1 rounded-[20px] border border-white/[0.15] bg-[#0B090C] p-6 backdrop-blur-[15px]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-sm leading-6">
          <span className="font-medium text-passes-gray-200">Date & Time</span>
          <span className="font-bold">Aug 29, 2022 5:53pm</span>
        </div>
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className="mt-3 flex items-center space-x-3">
        <h4 className="text-2xl font-bold leading-6">$20,001.89</h4>
        <div className="text-label flex items-center space-x-[3px] rounded-[56px] bg-passes-green/[0.17] py-1.5 px-3 text-passes-green">
          <span>3%</span>
          <ArrowUpRight />
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex justify-between border-b border-[#727272] pb-2">
          <div className="flex space-x-1.5">
            <DollarGrayIcon />
            <p className="text-xs font-medium leading-6 text-passes-gray-200">
              Purchased
            </p>
          </div>
          <p className="text-xs font-bold leading-6">609</p>
        </div>

        <div className="mb-2 flex justify-between border-b border-[#727272] pb-2">
          <div className="flex space-x-1.5">
            <HeartIcon />
            <p className="text-xs font-medium leading-6 text-passes-gray-200">
              Likes
            </p>
          </div>
          <p className="text-xs font-bold leading-6">$5.00</p>
        </div>

        <div className="mb-2 flex justify-between border-b border-[#727272] pb-2">
          <div className="flex space-x-1.5">
            <MessageIcon />
            <p className="text-xs font-medium leading-6 text-passes-gray-200">
              Comments
            </p>
          </div>
          <p className="text-xs font-bold leading-6">$3045.00</p>
        </div>

        <div className="mb-2 flex justify-between">
          <div className="flex space-x-1.5">
            <TipsIcon />
            <p className="text-xs font-medium leading-6 text-passes-gray-200">
              Tips
            </p>
          </div>
          <p className="text-xs font-bold leading-6">$3045.00</p>
        </div>
      </div>
    </div>
  )
}

export default PostStaticsMenu
