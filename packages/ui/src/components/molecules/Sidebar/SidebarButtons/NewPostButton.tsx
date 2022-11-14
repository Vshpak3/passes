import classNames from "classnames"
import PlusSign from "public/icons/plus-sign.svg"
import { FC, useState } from "react"

import { Button } from "src/components/atoms/button/Button"
import { NewPostPopup } from "src/components/molecules/scheduler/NewPostPopup"

interface NewPostButtonProps {
  isTablet?: boolean
}

export const NewPostButton: FC<NewPostButtonProps> = ({ isTablet = true }) => {
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  return (
    <>
      <NewPostPopup
        isOpen={isNewPostModalOpen}
        onCancel={() => setIsNewPostModalOpen(false)}
      />
      <Button
        className={classNames(
          { hidden: true }, // isTablet ? "hidden" : "lg:hidden"
          "my-5 flex h-12 w-12 items-center justify-center rounded-[50%]"
        )}
        onClick={() => setIsNewPostModalOpen(true)}
      >
        <PlusSign className="h-4 w-4" />
      </Button>
      <div className={classNames({ hidden: isTablet }, "lg:flex")}>
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
