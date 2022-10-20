import GraphIcon from "public/icons/graph.svg"
import React, { useState } from "react"

import {
  PostStatisticsMenu,
  PostStatisticsMenuProps
} from "./PostStatisticsMenu"

export type PostStatisticsButtonProps = Omit<PostStatisticsMenuProps, "onClose">

export const PostStatisticsButton: React.FC<PostStatisticsButtonProps> = (
  menuProps
) => {
  const [showPostStatisticsMenu, setShowPostStatisticsMenu] = useState(false)

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

  const toggleMenu = () => setShowPostStatisticsMenu(!showPostStatisticsMenu)

  return (
    <div className="relative flex-shrink-0">
      <button
        className="flex items-center rounded-lg bg-white/10 py-[5px] px-2.5"
        onMouseDown={stopPropagation}
        onClick={toggleMenu}
      >
        <span className="hidden whitespace-nowrap text-xs font-medium leading-[22px] md:block">
          Post Statistics
        </span>
        <span className="flex-shrink-0 md:ml-2">
          <GraphIcon />
        </span>
      </button>

      {showPostStatisticsMenu && (
        <PostStatisticsMenu {...menuProps} onClose={toggleMenu} />
      )}
    </div>
  )
}
