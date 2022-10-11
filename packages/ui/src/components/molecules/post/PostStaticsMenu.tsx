import { format } from "date-fns"
import ArrowUpRight from "public/icons/arrow-up-right.svg"
import DollarGrayIcon from "public/icons/dollar-gray.svg"
import HeartIcon from "public/icons/heart-gray.svg"
import MessageIcon from "public/icons/message-dots-square.svg"
import CloseIcon from "public/icons/sidebar-close-icon.svg"
import TipsIcon from "public/icons/tips.svg"
import { FC, useRef } from "react"
import { useOnClickOutside } from "src/hooks"
import { usePostData } from "src/hooks/usePostData"

interface PostStaticsMenuProps {
  onClose: () => void
}

const PostStaticsMenu: FC<PostStaticsMenuProps> = ({ onClose }) => {
  const {
    numLikes,
    earningsPurchases,
    createdAt,
    numPurchases,
    numComments,
    totalTipAmount
  } = usePostData()
  const menuEl = useRef(null)
  const formatDate = format(new Date(createdAt), "MMM dd, yyyy h:mm aaa")
  useOnClickOutside(menuEl, onClose)

  const purchasesPercentCounter = (total: number, earned: number) =>
    earned ? (earned * 100) / total : 0
  return (
    <div
      ref={menuEl}
      className="absolute top-full right-0 z-50 min-w-[325px] translate-y-1 rounded-[20px] border border-white/[0.15] bg-[#0B090C] p-6 backdrop-blur-[15px]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-sm leading-6">
          <span className="font-medium text-passes-gray-200">Date & Time</span>
          <span className="font-bold">{formatDate}</span>
        </div>
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className="mt-3 flex items-center space-x-3">
        <h4 className="text-2xl font-bold leading-6">${numPurchases}</h4>
        <div className="text-label flex items-center space-x-[3px] rounded-[56px] bg-passes-green/[0.17] py-1.5 px-3 text-passes-green">
          <span>
            {purchasesPercentCounter(numPurchases, earningsPurchases)}%
          </span>
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
          <p className="text-xs font-bold leading-6">{earningsPurchases}</p>
        </div>

        <div className="mb-2 flex justify-between border-b border-[#727272] pb-2">
          <div className="flex space-x-1.5">
            <HeartIcon />
            <p className="text-xs font-medium leading-6 text-passes-gray-200">
              Likes
            </p>
          </div>
          <p className="text-xs font-bold leading-6">{numLikes}</p>
        </div>

        <div className="mb-2 flex justify-between border-b border-[#727272] pb-2">
          <div className="flex space-x-1.5">
            <MessageIcon />
            <p className="text-xs font-medium leading-6 text-passes-gray-200">
              Comments
            </p>
          </div>
          <p className="text-xs font-bold leading-6">{numComments}</p>
        </div>

        <div className="mb-2 flex justify-between">
          <div className="flex space-x-1.5">
            <TipsIcon />
            <p className="text-xs font-medium leading-6 text-passes-gray-200">
              Tips
            </p>
          </div>
          <p className="text-xs font-bold leading-6">${totalTipAmount}</p>
        </div>
      </div>
    </div>
  )
}

export default PostStaticsMenu
