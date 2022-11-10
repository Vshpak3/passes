import PlusSign from "public/icons/plus-sign.svg"
import { FC, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { NewPostPopup } from "src/components/molecules/scheduler/NewPostPopup"

interface NewPostButtonProps {
  isMobile?: boolean
}

export const NewPostButton: FC<NewPostButtonProps> = ({ isMobile }) => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  return (
    <>
      <NewPostPopup
        isOpen={isNewPostModalOpen}
        onCancel={() => setIsNewPostModalOpen(false)}
      />
      <Button
        className={`my-5 flex h-12 w-12 items-center justify-center rounded-[50%] ${
          // isMobile ? "hidden" : "lg:hidden"
          "hidden"
        }`}
        onClick={() => setIsNewPostModalOpen(true)}
      >
        <PlusSign className="h-4 w-4" />
      </Button>
      <div className={`${isMobile ? "" : "hidden"} lg:flex`}>
        <Button
          className="mt-4 rounded-[5px]"
          fontSize={16}
          onClick={() => setIsNewPostModalOpen(true)}
        >
          <span className="px-[15px] py-[9px]">Create New Post</span>
        </Button>
      </div>
    </>
  )
}
