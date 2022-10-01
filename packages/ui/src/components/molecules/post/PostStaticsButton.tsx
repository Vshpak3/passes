import GraphIcon from "public/icons/graph.svg"
import React, { useState } from "react"

import PostStaticsMenu from "./PostStaticsMenu"

const PostStaticsButton = () => {
  const [showPostStaticsMenu, setShowPostStaticsMenu] = useState(false)

  return (
    <div className="relative flex-shrink-0">
      <button
        className="flex items-center space-x-2.5 rounded-lg bg-white/10 py-[5px] px-2.5"
        onClick={() => setShowPostStaticsMenu(true)}
      >
        <span className="whitespace-nowrap text-xs font-medium leading-[22px]">
          Post Statistics
        </span>
        <span className="flex-shrink-0">
          <GraphIcon />
        </span>
      </button>

      {showPostStaticsMenu && (
        <PostStaticsMenu onClose={() => setShowPostStaticsMenu(false)} />
      )}
    </div>
  )
}

export default PostStaticsButton
